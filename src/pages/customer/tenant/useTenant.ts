import { StatisticCardType } from "@/components/StatisticCard";
import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { createOrUpdateTenantSchema } from "@/lib/validation";
import TenantResponse, {
  ApiResponse,
  ICreateAndUpdateTenant,
  ITenantStatisticsResponse,
  TenantFilterValues,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UsersIcon, UserCheckIcon, UserXIcon, UserPlusIcon, BanIcon, LockIcon } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useTenant = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    query = "",
    gender = "",
    tenantStatus = "",
  } = queryFilter(searchParams, "page", "size", "query", "gender", "tenantStatus");

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<ICreateAndUpdateTenant>({
    address: "",
    dob: "",
    email: "",
    fullName: "",
    gender: "",
    identityCardNumber: "",
    phoneNumber: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ICreateAndUpdateTenant>();

  useEffect(() => {
    setFilterValues({
      gender,
      query,
      tenantStatus,
    });
  }, [gender, query, tenantStatus]);

  const [filterValues, setFilterValues] = useState<TenantFilterValues>({
    gender,
    query,
    tenantStatus,
  });

  const handleClear = () => {
    setFilterValues({
      gender: "",
      query: "",
      tenantStatus: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.gender) params.set("gender", filterValues.gender);
    if (filterValues.query) params.set("query", filterValues.query);
    if (filterValues.tenantStatus) params.set("tenantStatus", filterValues.tenantStatus);
    params.set("page", "1");
    if (filterValues.gender || filterValues.query || filterValues.tenantStatus) {
      setSearchParams(params);
    }
  }, [filterValues.gender, filterValues.query, filterValues.tenantStatus, setSearchParams]);

  const { data, isLoading, isError } = useQuery<ApiResponse<TenantResponse[]>>({
    queryKey: ["tenants", page, size, query, tenantStatus, gender],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (tenantStatus) params["tenantStatus"] = tenantStatus;
      if (gender) params["gender"] = gender;
      if (query) params["query"] = query;

      const res = await httpRequest.get("/tenants", {
        params,
      });

      return res.data;
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateTenantMutation = useMutation({
    mutationKey: ["update-tenant"],
    mutationFn: async (payload: ICreateAndUpdateTenant) => await httpRequest.put(`/tenants/${idRef.current}`, payload),
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const removeTenantMutation = useMutation({
    mutationKey: ["remove-tenant"],
    mutationFn: async (id: string) => await httpRequest.put(`/tenants/soft/${id}`),
  });

  const toggleStatusTenantMutation = useMutation({
    mutationKey: ["toggle-vehicle"],
    mutationFn: async (id: string) => await httpRequest.put(`/vehicles/toggle/${id}`),
  });

  const handleToggleStatusFloorById = async (id: string): Promise<boolean> => {
    try {
      await toggleStatusTenantMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "vehicles",
          });
          queryClient.invalidateQueries({ queryKey: ["vehicle-statistics"] });

          toast.success(Status.UPDATE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" | "status" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "delete") return await handleRemoveVehicleById(id);
      if (type === "status") return await handleToggleStatusFloorById(id);
      return false;
    },
  });

  const handleRemoveVehicleById = async (id: string): Promise<boolean> => {
    try {
      await removeTenantMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "tenants",
          });
          queryClient.invalidateQueries({ queryKey: ["tenants-statistics"] });

          toast.success(Status.REMOVE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleUpdateFloor = useCallback(async () => {
    try {
      const { address, dob, email, fullName, gender, identityCardNumber, phoneNumber } = value;

      await createOrUpdateTenantSchema.parseAsync(value);

      const data: ICreateAndUpdateTenant = {
        address: address.trim(),
        dob,
        email: email.trim(),
        fullName: fullName.trim(),
        identityCardNumber: identityCardNumber.trim(),
        gender,
        phoneNumber: phoneNumber.trim(),
      };

      updateTenantMutation.mutate(data, {
        onSuccess: () => {
          setValue({
            address: "",
            dob: "",
            email: "",
            fullName: "",
            gender: "",
            identityCardNumber: "",
            phoneNumber: "",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "tenants",
          });
          queryClient.invalidateQueries({ queryKey: ["tenants-statistics"] });
          toast.success(Status.UPDATE_SUCCESS);
          setIsModalOpen(false);
        },
      });
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [updateTenantMutation, clearErrors, handleZodErrors, queryClient, value]);

  const handleActionClick = useCallback(
    (tenant: TenantResponse, action: "update" | "delete") => {
      idRef.current = tenant.id;
      if (action === "update") {
        setValue({
          address: tenant.address || "",
          dob: tenant.dob || "",
          email: tenant.email || "",
          fullName: tenant.fullName || "",
          gender: tenant.gender || "",
          identityCardNumber: tenant.identityCardNumber || "",
          phoneNumber: tenant.phoneNumber || "",
        });
        setIsModalOpen(true);
      } else {
        openDialog(
          { id: tenant.id, type: action },
          {
            type: "warn",
            desc: action === "delete" ? Notice.REMOVE : Notice.TOGGLE_STATUS,
          }
        );
      }
    },
    [openDialog]
  );

  const { data: statistics, isError: errorStatistics } = useQuery<ApiResponse<ITenantStatisticsResponse>>({
    queryKey: ["tenants-statistics"],
    queryFn: async () => {
      const res = await httpRequest.get("/tenants/statistics");
      return res.data;
    },
  });

  const dataStatisticsTenants: StatisticCardType[] = [
    {
      icon: UsersIcon,
      label: "Tổng người thuê",
      value: statistics?.data.totalTenants ?? 0,
    },
    {
      icon: UserCheckIcon,
      label: "Đang thuê",
      value: statistics?.data.totalRentingTenants ?? 0,
    },
    {
      icon: UserXIcon,
      label: "Đã trả phòng",
      value: statistics?.data.totalCheckedOutTenants ?? 0,
    },
    {
      icon: UserPlusIcon,
      label: "Tiềm năng",
      value: statistics?.data.totalPotentialTenants ?? 0,
    },
    {
      icon: BanIcon,
      label: "Đã hủy",
      value: statistics?.data.totalCancelTenants ?? 0,
    },
    {
      icon: LockIcon,
      label: "Bị khóa",
      value: statistics?.data.totalLockedTenants ?? 0,
    },
  ];

  const { data: tenants, isError: isErrorTenants } = useQuery<ApiResponse<TenantResponse[]>>({
    queryKey: ["tenants-all"],
    queryFn: async () => {
      const res = await httpRequest.get("/tenants/all");
      return res.data;
    },
  });

  useEffect(() => {
    if (isErrorTenants) toast.error("Có lỗi xảy ra khi tải khách thuê");

    if (isError) {
      toast.error("Có lỗi xảy ra khi tải tầng");
    }

    if (errorStatistics) {
      toast.error("Có lỗi xảy ra khi tải thống kê tầng");
    }
  }, [isError, isErrorTenants, errorStatistics]);

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
  };

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      query,
      tenantStatus,
      gender,
    },
    setSearchParams,
    props,
    data,
    isLoading,
    dataStatisticsTenants,
    handleActionClick,
    rowSelection,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    handleUpdateFloor,
    value,
    setValue,
    errors,
    ConfirmDialog,
    tenants,
  };
};
