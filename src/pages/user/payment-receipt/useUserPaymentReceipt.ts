import { ApiResponse, PaginatedResponse, PaymentReceiptFilter, PaymentReceiptResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useUserPaymentReceipt = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
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

  const { data, isLoading, isError } = useQuery<ApiResponse<PaginatedResponse<PaymentReceiptResponse[]>>>({
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

      const res = await httpRequest.get("/payment-receipts/by-tenant", {
        params,
      });

      return res.data;
    },
    retry: 1,
  });

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
    rowSelection,
    setRowSelection,
  };
};
