import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ApiResponse,
  ContractResponse,
  ICreateAndUpdateContract,
  IContractStatisticsResponse,
  ContractFilterValues,
  TenantBasicResponse,
  RoomResponse,
} from "@/types";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { createOrUpdateContractSchema } from "@/lib/validation";
import { Status, Notice } from "@/enums";
import { handleMutationError } from "@/utils/handleMutationError";
import { queryFilter } from "@/utils/queryFilter";
import { httpRequest } from "@/utils/httpRequest";
import { FileText, Layers, XCircle, CalendarRange } from "lucide-react";

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

  const [filterValues, setFilterValues] = useState<ContractFilterValues>({ query, status });
  const [rowSelection, setRowSelection] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [value, setValue] = useState<ICreateAndUpdateContract>({
    roomId: "",
    numberOfPeople: 1,
    startDate: new Date(),
    endDate: new Date(),
    deposit: 0,
    tenants: [],
  });

  const { data: roomsData } = useQuery<ApiResponse<RoomResponse[]>>({
    queryKey: ["rooms-all"],
    queryFn: async () => (await httpRequest.get("/rooms/all")).data,
  });

  const { data: tenantsData } = useQuery<ApiResponse<TenantBasicResponse[]>>({
    queryKey: ["tenants-all"],
    queryFn: async () => (await httpRequest.get("/tenants/all")).data,
  });

  const roomOptions = roomsData?.data?.map((room) => ({
    label: `${room.roomCode}`,
    value: room.id,
  })) || [];

  const tenantOptions = tenantsData?.data?.map((tenant) => ({
    label: `${tenant.fullName} - ${tenant.phoneNumber}`,
    value: tenant.id,
  })) || [];

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ICreateAndUpdateContract>();

  useEffect(() => {
    setFilterValues({ query, status });
  }, [query, status]);
  const handleChange = <K extends keyof ICreateAndUpdateContract>(
  field: K,
  newValue: ICreateAndUpdateContract[K]
) => {
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
      const res = await httpRequest.get("/contracts", { params });
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
    { label: "Tổng hợp đồng", value: statistics?.data.totalContracts ?? 0, icon: Layers },
    { label: "Đang hoạt động", value: statistics?.data.totalActiveContracts ?? 0, icon: FileText },
    { label: "Đã huỷ", value: statistics?.data.totalCancelledContracts ?? 0, icon: XCircle },
    { label: "Hết hạn", value: statistics?.data.totalExpiredContracts ?? 0, icon: CalendarRange },
  ];

  const createContractMutation = useMutation({
    mutationFn: (payload: ICreateAndUpdateContract) =>
      httpRequest.post("/contracts", payload),
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
    });
    idRef.current = "";
    clearErrors();
  }, [clearErrors]);

  const handleSaveContract = useCallback(async () => {
    try {
      await createOrUpdateContractSchema.parseAsync(value);
      if (idRef.current) {
        await updateContractMutation.mutateAsync({ id: idRef.current, payload: value });
      } else {
        await createContractMutation.mutateAsync(value);
      }
      resetForm();
      setIsModalOpen(false);
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [value, updateContractMutation, createContractMutation, resetForm, handleZodErrors]);

  const handleActionClick = useCallback(
    (contract: ContractResponse, type: "update" | "delete" | "view") => {
      idRef.current = contract.id;
      if (type === "update") {
        setValue({
          roomId: contract.roomCode,
          numberOfPeople: contract.numberOfPeople,
          startDate: new Date(contract.startDate),
          endDate: new Date(contract.endDate),
          deposit: Number(contract.deposit),
          tenants: contract.tenants?.map((t) => t.id) ?? [],
        });
        setIsModalOpen(true);
      } else if (type === "delete") {
        openDialog({ id: contract.id }, { type: "warn", desc: Notice.REMOVE });
      } else {
        navigate(`/contracts/${contract.id}`, { state: { location } });
      }
    },
    [navigate, location, openDialog]
  );

  return {
    query: { page: parsedPage, size: parsedSize, ...filterValues },
    setSearchParams,
    props: { filterValues, setFilterValues, onClear: handleClear, onFilter: handleFilter },
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
    handleChange,
  };
};
