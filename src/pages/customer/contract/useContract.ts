import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { FileText, Layers, XCircle, CalendarRange } from "lucide-react";

import {
  ApiResponse,
  ContractResponse,
  IContractStatisticsResponse,
  ContractFilterValues,
  IUpdateContract,
} from "@/types";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { Status, Notice, VehicleType } from "@/enums";
import { handleMutationError } from "@/utils/handleMutationError";
import { queryFilter } from "@/utils/queryFilter";
import { httpRequest } from "@/utils/httpRequest";
import { updateContractSchema } from "@/lib/validation";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

export const switchVehicleType = (
  vehicleType: VehicleType | string,
  t: TFunction<"translate", undefined>
) => {
  switch (vehicleType) {
    case VehicleType.O_TO:
      return t("statusBadge.vehicleType.car");
    case VehicleType.XE_DAP:
      return t("statusBadge.vehicleType.bicycle");
    case VehicleType.XE_MAY:
      return t("statusBadge.vehicleType.motorbike");
    default:
      return t("statusBadge.vehicleType.other");
  }
};

export const useContract = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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

  const [value, setValue] = useState<IUpdateContract>({
    deposit: undefined,
    endDate: "",
    startDate: "",
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<IUpdateContract>();

  useEffect(() => {
    setFilterValues({ query, status });
  }, [query, status]);

  const handleChange = <K extends keyof IUpdateContract>(
    field: K,
    newValue: IUpdateContract[K]
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
    queryKey: ["contracts", page, size, query, status],
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
  const { data: statistics, isError: errorStatistics } = useQuery<
    ApiResponse<IContractStatisticsResponse>
  >({
    queryKey: ["contracts-statistics"],
    queryFn: async () => (await httpRequest.get("/contracts/statistics")).data,
    retry: 1,
  });

  useEffect(() => {
    if (isError) toast.error(t("contract.errorFetch"));
    if (errorStatistics) toast.error(t("contract.errorFetch"));
  }, [isError, errorStatistics, t]);

  const dataStatisticsContracts = [
    {
      label: t("statusBadge.statisticsContracts.total"),
      value: statistics?.data.totalContracts ?? 0,
      icon: Layers,
    },
    {
      label: t("statusBadge.statisticsContracts.active"),
      value: statistics?.data.totalActiveContracts ?? 0,
      icon: FileText,
    },
    {
      label: t("statusBadge.statisticsContracts.cancelled"),
      value: statistics?.data.totalCancelledContracts ?? 0,
      icon: XCircle,
    },
    {
      label: t("statusBadge.statisticsContracts.expired"),
      value: statistics?.data.totalExpiredContracts ?? 0,
      icon: CalendarRange,
    },
  ];

  const updateContractMutation = useMutation({
    mutationFn: (payload: IUpdateContract) =>
      httpRequest.put(`/contracts/${idRef.current}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });
      toast.success(Status.UPDATE_SUCCESS);
      setIsModalOpen(false);
    },
    onError: handleMutationError,
  });

  const handleUpdateContract = useCallback(async () => {
    try {
      const { deposit, endDate, startDate } = value;

      const data: IUpdateContract = {
        deposit: deposit || 0,
        endDate,
        startDate,
      };

      await updateContractSchema.parseAsync(data);
      await updateContractMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [updateContractMutation, clearErrors, handleZodErrors, value]);

  const deleteContractMutation = useMutation({
    mutationFn: (id: string) => httpRequest.put(`/contracts/soft/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });
      toast.success(Status.REMOVE_SUCCESS);
    },
    onError: handleMutationError,
  });

  const activeContractMutation = useMutation({
    mutationFn: (id: string) => httpRequest.put(`/contracts/activate/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });
      toast.success(t("contract.activateSuccess"));
    },
    onError: handleMutationError,
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" | "cash" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "cash") {
        try {
          await activeContractMutation.mutateAsync(id);
          return true;
        } catch {
          return false;
        }
      } else
        try {
          await deleteContractMutation.mutateAsync(id);
          return true;
        } catch {
          return false;
        }
    },
  });

  const handleActionClick = useCallback(
    (
      contract: ContractResponse,
      type: "update" | "delete" | "view" | "toggle" | "cash" | "deposit1"
    ) => {
      idRef.current = contract.id;

      if (type === "update") {
        setValue({
          deposit: contract.deposit,
          endDate: contract.endDate,
          startDate: contract.startDate,
        });
        setIsModalOpen(true);
      } else if (type === "delete") {
        openDialog({ id: contract.id, type }, { type: "warn", desc: Notice.REMOVE });
      } else if (type === "view") {
        navigate(`/customers/contracts/${contract.id}`);
      } else if (type === "cash") {
        openDialog(
          { id: contract.id, type },
          { type: "warn", desc: t("contract.confirmActivate") }
        );
      } else if (type === "deposit1") {
        navigate(`/customers/contracts/vehicles/${contract.id}`);
      } else {
        navigate(`/customers/contracts/tenants/${contract.id}`);
      }
    },
    [navigate, openDialog, t]
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
    isModalOpen,
    setIsModalOpen,
    errors,
    handleActionClick,
    ConfirmDialog,
    rowSelection,
    setRowSelection,
    handleChange,
    handleUpdateContract,
  };
};
