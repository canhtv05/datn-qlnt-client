import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { FileText, Layers, XCircle, CalendarRange } from "lucide-react";

import {
  ApiResponse,
  ContractResponse,
  ICreateAndUpdateContract,
  IContractStatisticsResponse,
  ContractFilterValues,
  TenantBasicResponse,
  RoomResponse,
  AssetResponse,
  ServiceResponse,
  VehicleResponse,
} from "@/types";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { createOrUpdateContractSchema } from "@/lib/validation";
import { Status, Notice } from "@/enums";
import { handleMutationError } from "@/utils/handleMutationError";
import { queryFilter } from "@/utils/queryFilter";
import { httpRequest } from "@/utils/httpRequest";

export const useContract = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    page = "1",
    size = "15",
    query = "",
    status = "",
  } = queryFilter(searchParams, "page", "size", "query", "status");

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const idRef = useRef<string>("");

  const [filterValues, setFilterValues] = useState<ContractFilterValues>({
    query,
    status,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [value, setValue] = useState<ICreateAndUpdateContract>({
    roomId: "",
    numberOfPeople: 1,
    startDate: new Date(),
    endDate: new Date(),
    deposit: 0,
    tenants: [],
    assets: [],
    services: [],
    vehicles: [],
    status: undefined,
  });

  const { data: roomsData } = useQuery<ApiResponse<RoomResponse[]>>({
    queryKey: ["rooms-all"],
    queryFn: async () => (await httpRequest.get("/rooms/all")).data,
  });

  const { data: tenantsData } = useQuery<ApiResponse<TenantBasicResponse[]>>({
    queryKey: ["tenants-all"],
    queryFn: async () => (await httpRequest.get("/tenants/all")).data,
  });

  const { data: assetsData } = useQuery<ApiResponse<AssetResponse[]>>({
    queryKey: ["assets-all"],
    queryFn: async () => (await httpRequest.get("/assets/find-all")).data,
  });

  const { data: servicesDaTa } = useQuery<ApiResponse<ServiceResponse[]>>({
    queryKey: ["services"],
    queryFn: async () => (await httpRequest.get("/services")).data,
  });

  const { data: vehiclesDaTa } = useQuery<ApiResponse<VehicleResponse[]>>({
    queryKey: ["vehicles"],
    queryFn: async () => (await httpRequest.get("/vehicles")).data,
  });
  const roomOptions =
    roomsData?.data?.map((room) => ({
      label: `${room.roomCode} - ${room.floor.buildingName}`,
      value: room.id,
    })) || [];

  const tenantOptions =
    tenantsData?.data?.map((tenant) => ({
      label: `${tenant.fullName} - ${tenant.phoneNumber}`,
      value: tenant.id,
    })) || [];

  const assetOptions =
    assetsData?.data?.map((asset) => ({
      label: asset.nameAsset,
      value: asset.id,
    })) || [];

  const servicesOptions =
    servicesDaTa?.data?.map((services) => ({
      label: services.name,
      value: services.id,
    })) || [];

  const vehiclesOptions =
    vehiclesDaTa?.data?.map((vehicles) => ({
      label: `${vehicles.fullName} - ${vehicles.vehicleType}`,
      value: vehicles.id,
    })) || [];
  const { clearErrors, errors, handleZodErrors } = useFormErrors<ICreateAndUpdateContract>();

  useEffect(() => {
    setFilterValues({ query, status });
  }, [query, status]);

  const handleChange = <K extends keyof ICreateAndUpdateContract>(field: K, newValue: ICreateAndUpdateContract[K]) => {
    setValue((prev) => ({
      ...prev,
      [field]: newValue,
    }));
  };

  const handleClear = () => {
    setFilterValues({ query: "", status: "" });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filterValues).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set("page", "1");
    setSearchParams(params);
  }, [filterValues, setSearchParams]);

  const endpoint = filterValues.status === "DA_HUY" ? "/contracts/cancel" : "/contracts";

  const { data, isLoading, isError } = useQuery<ApiResponse<ContractResponse[]>>({
    queryKey: ["contracts", page, size, ...Object.values(filterValues)],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: parsedPage.toString(),
        size: parsedSize.toString(),
      };
      Object.entries(filterValues).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await httpRequest.get(endpoint, { params });
      return res.data;
    },
    retry: 1,
  });
  const { data: statistics, isError: errorStatistics } = useQuery<ApiResponse<IContractStatisticsResponse>>({
    queryKey: ["contracts-statistics"],
    queryFn: async () => (await httpRequest.get("/contracts/statistics")).data,
    retry: 1,
  });

  useEffect(() => {
    if (isError) toast.error("Lỗi khi tải danh sách hợp đồng");
    if (errorStatistics) toast.error("Lỗi khi tải thống kê hợp đồng");
  }, [isError, errorStatistics]);

  const dataStatisticsContracts = [
    {
      label: "Tổng hợp đồng",
      value: statistics?.data.totalContracts ?? 0,
      icon: Layers,
    },
    {
      label: "Đang hoạt động",
      value: statistics?.data.totalActiveContracts ?? 0,
      icon: FileText,
    },
    {
      label: "Đã huỷ",
      value: statistics?.data.totalCancelledContracts ?? 0,
      icon: XCircle,
    },
    {
      label: "Hết hạn",
      value: statistics?.data.totalExpiredContracts ?? 0,
      icon: CalendarRange,
    },
  ];

  const createContractMutation = useMutation({
    mutationFn: (payload: ICreateAndUpdateContract) => httpRequest.post("/contracts", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });
      toast.success(Status.ADD_SUCCESS);
    },
    onError: handleMutationError,
  });

  const updateContractMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ICreateAndUpdateContract }) =>
      httpRequest.put(`/contracts/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });
      toast.success(Status.UPDATE_SUCCESS);
    },
    onError: handleMutationError,
  });

  const deleteContractMutation = useMutation({
    mutationFn: (id: string) => httpRequest.put(`/contracts/soft/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });
      toast.success(Status.REMOVE_SUCCESS);
    },
    onError: handleMutationError,
  });

  const toggleContractMutation = useMutation({
    mutationFn: (id: string) => httpRequest.put(`/contracts/toggle/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });
      toast.success("Chuyển đổi trạng thái thành công");
    },
    onError: handleMutationError,
  });

  const handleToggleStatus = useCallback(
    async (id: string) => {
      try {
        await toggleContractMutation.mutateAsync(id);
      } catch {
        // error đã được xử lý bên trên
      }
    },
    [toggleContractMutation]
  );

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string }>({
    onConfirm: async ({ id }) => {
      try {
        await deleteContractMutation.mutateAsync(id);
        return true;
      } catch {
        return false;
      }
    },
  });

  const resetForm = useCallback(() => {
    setValue({
      roomId: "",
      numberOfPeople: 1,
      startDate: new Date(),
      endDate: new Date(),
      deposit: 0,
      tenants: [],
      assets: [],
      services: [],
      vehicles: [],
      status: undefined,
    });
    idRef.current = "";
    clearErrors();
  }, [clearErrors]);

  const handleSaveContract = useCallback(async () => {
    try {
      await createOrUpdateContractSchema.parseAsync(value);

      if (idRef.current) {
        await updateContractMutation.mutateAsync({
          id: idRef.current,
          payload: value,
        });
      } else {
        const selectedRoom = roomsData?.data?.find((room) => room.id === value.roomId);
        const roomPrice = selectedRoom?.price ?? 0;

        await createContractMutation.mutateAsync({
          ...value,
          roomPrice,
        });
      }

      resetForm();
      setIsModalOpen(false);
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [value, updateContractMutation, createContractMutation, resetForm, handleZodErrors, roomsData]);

  const handleActionClick = useCallback(
    (contract: ContractResponse, type: "update" | "delete" | "view" | "status") => {
      idRef.current = contract.id;

      if (type === "update") {
        const matchedRoom = roomsData?.data?.find((r) => r.roomCode === contract.roomCode);
        setValue({
          roomId: matchedRoom?.id ?? "",
          numberOfPeople: contract.numberOfPeople,
          startDate: new Date(contract.startDate),
          endDate: new Date(contract.endDate),
          deposit: Number(contract.deposit),
          tenants: contract.tenants?.map((t) => t.id) ?? [],
          assets: contract.assets?.map((a) => a.id) ?? [],
          services: [],
          vehicles: [],
          status: contract.status,
        });

        setIsModalOpen(true);
      } else if (type === "delete") {
        openDialog({ id: contract.id }, { type: "warn", desc: Notice.REMOVE });
      } else if (type === "status") {
        handleToggleStatus(contract.id);
      } else {
        navigate(`/customers/contracts/${contract.id}`, {
          state: { location },
        });
      }
    },
    [navigate, location, openDialog, handleToggleStatus, roomsData]
  );

  return {
    query: { page: parsedPage, size: parsedSize, ...filterValues },
    setSearchParams,
    props: {
      filterValues,
      setFilterValues,
      onClear: handleClear,
      onFilter: handleFilter,
    },
    data,
    isLoading,
    dataStatisticsContracts,
    value,
    setValue,
    handleSaveContract,
    isModalOpen,
    setIsModalOpen,
    errors,
    handleActionClick,
    ConfirmDialog,
    rowSelection,
    setRowSelection,
    roomOptions,
    tenantOptions,
    assetOptions,
    servicesOptions,
    vehiclesOptions,
    handleChange,
    handleToggleStatus,
  };
};
