import { Notice, Status } from "@/enums";
import { useConfirmDialog } from "@/hooks";
import {
  ApiResponse,
  PaginatedResponse,
  PaymentReceiptFilter,
  PaymentReceiptResponse,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const usePaymentReceipt = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    query = "",
    paymentStatus = "",
    paymentMethod = "",
    fromAmount = "",
    toAmount = "",
    fromDate = "",
    toDate = "",
  } = queryFilter(
    searchParams,
    "page",
    "size",
    "query",
    "paymentStatus",
    "paymentMethod",
    "fromAmount",
    "toAmount",
    "fromDate",
    "toDate"
  );

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<PaymentReceiptFilter>({
    fromAmount: undefined,
    fromDate: "",
    paymentMethod: "",
    paymentStatus: "",
    query: "",
    toAmount: undefined,
    toDate: "",
  });

  const handleClear = () => {
    setFilterValues({
      fromAmount: undefined,
      fromDate: "",
      paymentMethod: "",
      paymentStatus: "",
      query: "",
      toAmount: undefined,
      toDate: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.fromAmount) params.set("fromAmount", filterValues.fromAmount + "");
    if (filterValues.toAmount) params.set("toAmount", filterValues.toAmount + "");
    if (filterValues.fromDate) params.set("fromDate", filterValues.fromDate);
    if (filterValues.paymentMethod) params.set("paymentMethod", String(filterValues.paymentMethod));
    if (filterValues.paymentStatus) params.set("paymentStatus", filterValues.paymentStatus);
    if (filterValues.query) params.set("query", filterValues.query);
    if (filterValues.toDate) params.set("toDate", filterValues.toDate);
    params.set("page", "1");
    if (
      filterValues.fromAmount ||
      filterValues.toAmount ||
      filterValues.fromDate ||
      filterValues.paymentMethod ||
      filterValues.paymentStatus ||
      filterValues.query ||
      filterValues.toDate
    ) {
      setSearchParams(params);
    }
  }, [
    filterValues.fromAmount,
    filterValues.fromDate,
    filterValues.paymentMethod,
    filterValues.paymentStatus,
    filterValues.query,
    filterValues.toAmount,
    filterValues.toDate,
    setSearchParams,
  ]);

  const { data, isLoading, isError } = useQuery<
    ApiResponse<PaginatedResponse<PaymentReceiptResponse[]>>
  >({
    queryKey: [
      "payment-receipts",
      page,
      size,
      fromAmount,
      fromDate,
      paymentMethod,
      paymentStatus,
      query,
      toAmount,
      toDate,
    ],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (fromAmount) params["fromAmount"] = fromAmount;
      if (paymentMethod) params["paymentMethod"] = paymentMethod;
      if (paymentStatus) params["paymentStatus"] = paymentStatus;
      if (query) params["query"] = query;
      if (toAmount) params["toAmount"] = toAmount;
      if (toDate) params["toDate"] = toDate;

      const res = await httpRequest.get("/payment-receipts", {
        params,
      });

      return res.data;
    },
    retry: 1,
  });

  const removePaymentReceiptMutation = useMutation({
    mutationKey: ["remove-payment-receipt"],
    mutationFn: async (id: string) => await httpRequest.delete(`/payment-receipts/${id}`),
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "delete") return await handleRemovePaymentReceiptById(id);
      return false;
    },
  });

  const handleRemovePaymentReceiptById = async (id: string): Promise<boolean> => {
    try {
      await removePaymentReceiptMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) && query.queryKey[0] === "payment-receipts",
          });
          toast.success(t(Status.REMOVE_SUCCESS));
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const confirmCashPaymentMutation = useMutation({
    mutationKey: ["confirm-cash-payment"],
    mutationFn: async (id: string) =>
      await httpRequest.patch(`/payment-receipts/payment-confirm/${id}`),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(t(Status.UPDATE_SUCCESS));
      queryClient.invalidateQueries({
        predicate: (prev) => {
          return Array.isArray(prev.queryKey) && prev.queryKey[0] === "payment-receipts";
        },
      });
      queryClient.invalidateQueries({
        predicate: (prev) => {
          return Array.isArray(prev.queryKey) && prev.queryKey[0] === "system-notifications";
        },
      });
      queryClient.invalidateQueries({ queryKey: ["unread-all"] });
    },
  });

  const handleConfirmCashPaymentMutation = useCallback(
    (id: string) => {
      try {
        confirmCashPaymentMutation.mutate(id);
        return true;
      } catch {
        return false;
      }
    },
    [confirmCashPaymentMutation]
  );

  const handleActionClick = useCallback(
    (paymentReceipt: PaymentReceiptResponse, action: "delete" | "view" | "cash") => {
      idRef.current = paymentReceipt.id;

      if (action === "view") {
        navigate(`/finance/invoice/view/${paymentReceipt.invoiceId}`, { replace: true });
      } else if (action === "cash") {
        handleConfirmCashPaymentMutation(paymentReceipt.id);
      } else
        openDialog(
          { id: paymentReceipt.id, type: action },
          {
            type: "warn",
            desc: t(Notice.REMOVE),
          }
        );
    },
    [handleConfirmCashPaymentMutation, navigate, openDialog, t]
  );

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
  };

  useEffect(() => {
    if (isError) {
      toast.error(t("paymentReceipt.errorFetch"));
    }
  }, [isError, t]);

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      fromAmount,
      toAmount,
      fromDate,
      toDate,
      paymentMethod,
      paymentStatus,
      query,
    },
    setSearchParams,
    props,
    data,
    isLoading,
    handleActionClick,
    rowSelection,
    setRowSelection,
    ConfirmDialog,
  };
};
