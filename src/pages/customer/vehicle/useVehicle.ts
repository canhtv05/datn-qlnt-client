import { StatisticCardType } from "@/components/StatisticCard";
import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { updateVehicleSchema } from "@/lib/validation";
import TenantResponse, {
  ApiResponse,
  IUpdateVehicle,
  VehicleFilterValues,
  VehicleResponse,
  VehicleStatisticsResponse,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BikeIcon, Building, CarIcon, MoreHorizontalIcon, RecycleIcon } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useVehicle = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    vehicleType = "",
    licensePlate = "",
  } = queryFilter(searchParams, "page", "size", "vehicleType", "licensePlate");

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<IUpdateVehicle>({
    describe: "",
    vehicleStatus: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const { clearErrors, errors, handleZodErrors } = useFormErrors<IUpdateVehicle>();

  useEffect(() => {
    setFilterValues({
      licensePlate,
      vehicleType,
    });
  }, [licensePlate, vehicleType]);

  const [filterValues, setFilterValues] = useState<VehicleFilterValues>({
    licensePlate,
    vehicleType,
  });

  const handleClear = () => {
    setFilterValues({
      licensePlate: "",
      vehicleType: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.licensePlate) params.set("licensePlate", filterValues.licensePlate);
    if (filterValues.vehicleType) params.set("vehicleType", filterValues.vehicleType);
    params.set("page", "1");
    if (filterValues.licensePlate || filterValues.vehicleType) {
      setSearchParams(params);
    }
  }, [setSearchParams, filterValues.licensePlate, filterValues.vehicleType]);

  const { data, isLoading, isError } = useQuery<ApiResponse<VehicleResponse[]>>({
    queryKey: ["vehicles", page, size, licensePlate, vehicleType],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (licensePlate) params["licensePlate"] = licensePlate;
      if (vehicleType) params["vehicleType"] = vehicleType;

      const res = await httpRequest.get("/vehicles", {
        params,
      });

      return res.data;
    },
    retry: 1,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateVehicleMutation = useMutation({
    mutationKey: ["update-vehicle"],
    mutationFn: async (payload: IUpdateVehicle) =>
      await httpRequest.put(`/vehicles/${idRef.current}`, payload),
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const removeVehicleMutation = useMutation({
    mutationKey: ["remove-vehicle"],
    mutationFn: async (id: string) => await httpRequest.put(`/vehicles/soft-delete/${id}`),
  });

  const toggleStatusVehicleMutation = useMutation({
    mutationKey: ["toggle-vehicle"],
    mutationFn: async (id: string) => await httpRequest.put(`/vehicles/toggle-status/${id}`),
  });

  const handleToggleStatusFloorById = async (id: string): Promise<boolean> => {
    try {
      await toggleStatusVehicleMutation.mutateAsync(id, {
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

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" | "status" }>(
    {
      onConfirm: async ({ id, type }) => {
        if (type === "delete") return await handleRemoveVehicleById(id);
        if (type === "status") return await handleToggleStatusFloorById(id);
        return false;
      },
    }
  );

  const handleRemoveVehicleById = async (id: string): Promise<boolean> => {
    try {
      await removeVehicleMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "vehicles",
          });
          queryClient.invalidateQueries({ queryKey: ["vehicle-statistics"] });

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
      const { describe, vehicleStatus } = value;

      await updateVehicleSchema.parseAsync(value);

      const data: IUpdateVehicle = {
        describe: describe.trim(),
        vehicleStatus,
      };

      updateVehicleMutation.mutate(data, {
        onSuccess: () => {
          setValue({
            describe: "",
            vehicleStatus: "",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "vehicles",
          });
          queryClient.invalidateQueries({ queryKey: ["vehicle-statistics"] });
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
  }, [updateVehicleMutation, clearErrors, handleZodErrors, queryClient, value]);

  const handleActionClick = useCallback(
    (floor: VehicleResponse, action: "update" | "delete") => {
      idRef.current = floor.id;
      if (action === "update") {
        setValue({
          describe: floor.describe,
          vehicleStatus: floor.vehicleStatus,
        });
        setIsModalOpen(true);
      } else {
        openDialog(
          { id: floor.id, type: action },
          {
            type: "warn",
            desc: action === "delete" ? t(Notice.REMOVE) : t(Notice.TOGGLE_STATUS),
          }
        );
      }
    },
    [openDialog, t]
  );

  const { data: statistics, isError: errorStatistics } = useQuery<
    ApiResponse<VehicleStatisticsResponse>
  >({
    queryKey: ["vehicle-statistics"],
    queryFn: async () => {
      const res = await httpRequest.get("/vehicles/statistics");
      return res.data;
    },
    retry: 1,
  });

  const dataVehicles: StatisticCardType[] = [
    {
      icon: Building,
      label: t("statusBadge.vehicleType.total"),
      value: statistics?.data.total ?? 0,
    },
    {
      icon: BikeIcon,
      label: t("statusBadge.vehicleType.motorbike"),
      value: statistics?.data?.byType?.motorbike ?? 0,
    },
    {
      icon: CarIcon,
      label: t("statusBadge.vehicleType.car"),
      value: statistics?.data?.byType?.car ?? 0,
    },
    {
      icon: RecycleIcon,
      label: t("statusBadge.vehicleType.bicycle"),
      value: statistics?.data?.byType?.bicycle ?? 0,
    },
    {
      icon: MoreHorizontalIcon,
      label: t("statusBadge.vehicleType.other"),
      value: statistics?.data?.byType?.other ?? 0,
    },
  ];

  const { data: tenants, isError: isErrorTenants } = useQuery<ApiResponse<TenantResponse[]>>({
    queryKey: ["tenants-all"],
    queryFn: async () => {
      const res = await httpRequest.get("/tenants/all");
      return res.data;
    },
    retry: 1,
  });

  useEffect(() => {
    if (isErrorTenants) toast.error(t("tenant.errorFetch"));

    if (isError) {
      toast.error(t("floor.errorFetch"));
    }

    if (errorStatistics) {
      toast.error(t("floor.errorFetchStatistics"));
    }
  }, [isError, isErrorTenants, errorStatistics, t]);

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
      licensePlate,
      vehicleType,
    },
    setSearchParams,
    props,
    data,
    isLoading,
    dataVehicles,
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
