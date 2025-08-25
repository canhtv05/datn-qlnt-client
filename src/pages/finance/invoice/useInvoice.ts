import { StatisticCardType } from "@/components/StatisticCard";
import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { updateInvoiceSchema } from "@/lib/validation";
import {
  ApiResponse,
  BuildingSelectResponse,
  ContractResponse,
  IdAndName,
  InvoiceFilter,
  InvoiceResponse,
  InvoiceStatistics,
  InvoiceUpdateRequest,
} from "@/types";
import cookieUtil from "@/utils/cookieUtil";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isNumber } from "lodash";
import { AlarmClock, Ban, CheckCircle2, Clock3, Hourglass, ReceiptText, XCircle } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useInvoice = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    building = "",
    floor = "",
    month = "",
    year = "",
    minTotalAmount = "",
    maxTotalAmount = "",
    invoiceStatus = "",
    invoiceType = "",
    query = "",
  } = queryFilter(
    searchParams,
    "page",
    "size",
    "building",
    "floor",
    "month",
    "year",
    "minTotalAmount",
    "maxTotalAmount",
    "invoiceStatus",
    "invoiceType",
    "query"
  );

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<InvoiceUpdateRequest>({
    note: "",
    paymentDueDate: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const { clearErrors, errors, handleZodErrors } = useFormErrors<InvoiceUpdateRequest>();

  const [filterValues, setFilterValues] = useState<InvoiceFilter>({
    building,
    floor,
    invoiceStatus,
    invoiceType,
    maxTotalAmount: isNumber(maxTotalAmount) ? Number(maxTotalAmount) : undefined,
    minTotalAmount: isNumber(minTotalAmount) ? Number(minTotalAmount) : undefined,
    month: isNumber(month) ? Number(month) : undefined,
    year: isNumber(year) ? Number(year) : undefined,
    query,
  });

  const handleClear = () => {
    setFilterValues({
      building: "",
      floor: "",
      month: undefined,
      year: undefined,
      minTotalAmount: undefined,
      maxTotalAmount: undefined,
      invoiceStatus: "",
      invoiceType: "",
      query: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.building) params.set("building", filterValues.building);
    if (filterValues.floor) params.set("floor", filterValues.floor);
    if (filterValues.invoiceStatus) params.set("invoiceStatus", filterValues.invoiceStatus);
    if (filterValues.invoiceType) params.set("invoiceType", filterValues.invoiceType);
    if (filterValues.maxTotalAmount) params.set("maxTotalAmount", filterValues.maxTotalAmount.toString());
    if (filterValues.minTotalAmount) params.set("minTotalAmount", filterValues.minTotalAmount.toString());
    if (filterValues.month) params.set("month", filterValues.month.toString());
    if (filterValues.year) params.set("year", filterValues.year.toString());
    if (filterValues.query) params.set("query", filterValues.query);
    params.set("page", "1");
    if (
      filterValues.building ||
      filterValues.floor ||
      filterValues.invoiceStatus ||
      filterValues.invoiceType ||
      filterValues.maxTotalAmount ||
      filterValues.minTotalAmount ||
      filterValues.month ||
      filterValues.query ||
      filterValues.year
    ) {
      setSearchParams(params);
    }
  }, [
    filterValues.building,
    filterValues.floor,
    filterValues.invoiceStatus,
    filterValues.invoiceType,
    filterValues.maxTotalAmount,
    filterValues.minTotalAmount,
    filterValues.month,
    filterValues.query,
    filterValues.year,
    setSearchParams,
  ]);

  const { data, isLoading, isError } = useQuery<ApiResponse<InvoiceResponse[]>>({
    queryKey: [
      "invoices",
      page,
      size,
      building,
      floor,
      invoiceStatus,
      invoiceType,
      maxTotalAmount,
      minTotalAmount,
      month,
      query,
      year,
    ],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (building) params["building"] = building;
      if (query) params["query"] = query;
      if (floor) params["floor"] = floor;
      if (invoiceStatus) params["invoiceStatus"] = invoiceStatus;
      if (invoiceType) params["invoiceType"] = invoiceType;
      if (maxTotalAmount) params["maxTotalAmount"] = maxTotalAmount;
      if (minTotalAmount) params["minTotalAmount"] = minTotalAmount;
      if (month) params["month"] = month;
      if (query) params["query"] = query;
      if (year) params["year"] = year;

      const res = await httpRequest.get("/invoices", {
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

  const updateInvoiceMutation = useMutation({
    mutationKey: ["update-invoice"],
    mutationFn: async (payload: InvoiceUpdateRequest) => await httpRequest.put(`/invoices/${idRef.current}`, payload),
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const removeInvoiceMutation = useMutation({
    mutationKey: ["remove-invoice"],
    mutationFn: async (id: string) => await httpRequest.put(`/invoices/soft/${id}`),
  });

  const toggleStatusInvoiceMutation = useMutation({
    mutationKey: ["toggle-invoice"],
    mutationFn: async (id: string) => await httpRequest.put(`/invoices/toggle/${id}`),
  });

  const handleToggleStatusInvoiceById = async (id: string): Promise<boolean> => {
    try {
      await toggleStatusInvoiceMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "invoices",
          });
          queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });

          toast.success(Status.UPDATE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" | "status" | "view" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "delete") return await handleRemoveInvoiceById(id);
      if (type === "status") return await handleToggleStatusInvoiceById(id);
      return false;
    },
  });

  const handleRemoveInvoiceById = async (id: string): Promise<boolean> => {
    try {
      await removeInvoiceMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "invoices",
          });
          queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });

          toast.success(Status.REMOVE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleUpdateInvoice = useCallback(async () => {
    try {
      const { note, paymentDueDate } = value;

      await updateInvoiceSchema.parseAsync(value);

      const data: InvoiceUpdateRequest = {
        note: note.trim(),
        paymentDueDate,
      };

      updateInvoiceMutation.mutate(data, {
        onSuccess: () => {
          setValue({
            note: "",
            paymentDueDate: "",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "invoices",
          });
          queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });

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
  }, [updateInvoiceMutation, clearErrors, handleZodErrors, queryClient, value]);

  const handleActionClick = useCallback(
    (invoice: InvoiceResponse, action: "update" | "delete" | "status" | "view") => {
      idRef.current = invoice.id;
      if (action === "update") {
        setValue({
          note: invoice.note,
          paymentDueDate: invoice.paymentDueDate,
        });
        setIsModalOpen(true);
      } else if (action !== "view") {
        openDialog(
          { id: invoice.id, type: action },
          {
            type: "warn",
            desc: action === "delete" ? Notice.REMOVE : Notice.TOGGLE_STATUS,
          }
        );
      } else {
        navigate(`/finance/invoice/${invoice.id}`, {
          replace: true,
        });
        cookieUtil.setStorage({ roomId: invoice.roomId });
      }
    },
    [navigate, openDialog]
  );

  const { data: contractInitToAdd, isError: errorContractInitToAdd } = useQuery<ApiResponse<ContractResponse[]>>({
    queryKey: ["contractFilter"],
    queryFn: async () => {
      const res = await httpRequest.get("/contracts/all");
      return res.data;
    },
    retry: false,
  });

  const { data: buildingInitToAdd, isError: errorBuildingInitToAdd } = useQuery<ApiResponse<IdAndName[]>>({
    queryKey: ["buildingInitToAdd"],
    queryFn: async () => {
      const res = await httpRequest.get("/buildings/all");
      return res.data;
    },
    retry: false,
  });

  const { data: floorInitToAdd, isError: errorFloorInitToAdd } = useQuery<ApiResponse<IdAndName[]>>({
    queryKey: ["floorInitToAdd"],
    queryFn: async () => {
      const res = await httpRequest.get("/floors/all");
      return res.data;
    },
    retry: false,
  });

  const { data: buildingFilter, isError: errorBuildingFilter } = useQuery<ApiResponse<BuildingSelectResponse[]>>({
    queryKey: ["buildingFilter"],
    queryFn: async () => {
      const res = await httpRequest.get("/buildings/init");
      return res.data;
    },
    retry: false,
  });

  const { data: invoiceStatistics, isError: errorInvoiceStatistics } = useQuery<ApiResponse<InvoiceStatistics>>({
    queryKey: ["invoice-statistics"],
    queryFn: async () => {
      const res = await httpRequest.get("/invoices/statistics");
      return res.data;
    },
    retry: false,
  });

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
    buildingFilter,
  };

  useEffect(() => {
    if (isError) {
      toast.error("Có lỗi xảy ra khi tải hóa đơn");
    }

    if (errorContractInitToAdd) {
      toast.error("Có lỗi xảy ra khi tải hợp đồng");
    }

    if (errorBuildingInitToAdd) {
      toast.error("Có lỗi xảy ra khi tải tòa nhà");
    }

    if (errorFloorInitToAdd) {
      toast.error("Có lỗi xảy ra khi tải tầng nhà");
    }

    if (errorBuildingFilter) {
      toast.error("Có lỗi xảy ra khi tải lọc tòa nhà");
    }

    if (errorInvoiceStatistics) {
      toast.error("Có lỗi xảy ra khi tải thống kê hóa đơn");
    }
  }, [
    errorBuildingFilter,
    isError,
    errorContractInitToAdd,
    errorBuildingInitToAdd,
    errorFloorInitToAdd,
    errorInvoiceStatistics,
  ]);
  const dataInvoiceStatistics: StatisticCardType[] = [
    {
      icon: ReceiptText,
      label: "Tổng hoá đơn",
      value: invoiceStatistics?.data.total ?? 0,
    },
    {
      icon: CheckCircle2,
      label: "Đã thanh toán",
      value: invoiceStatistics?.data.totalPaid ?? 0,
    },
    {
      icon: Clock3,
      label: "Chưa thanh toán",
      value: invoiceStatistics?.data.totalNotYetPaid ?? 0,
    },
    {
      icon: Hourglass,
      label: "Chờ thanh toán",
      value: invoiceStatistics?.data.totalWaitingForPayment ?? 0,
    },
    {
      icon: XCircle,
      label: "Không thể thanh toán",
      value: invoiceStatistics?.data.totalCannotBePaid ?? 0,
    },
    {
      icon: AlarmClock,
      label: "Quá hạn",
      value: invoiceStatistics?.data.totalOverdue ?? 0,
    },
    {
      icon: Ban,
      label: "Đã huỷ",
      value: invoiceStatistics?.data.totalCancelled ?? 0,
    },
  ];

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      building,
      floor,
      month,
      year,
      minTotalAmount,
      maxTotalAmount,
      invoiceStatus,
      invoiceType,
      query,
    },
    setSearchParams,
    contractInitToAdd,
    dataInvoiceStatistics,
    props,
    data,
    isLoading,
    handleActionClick,
    rowSelection,
    floorInitToAdd,
    buildingInitToAdd,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    handleUpdateFloor: handleUpdateInvoice,
    value,
    setValue,
    errors,
    ConfirmDialog,
  };
};
