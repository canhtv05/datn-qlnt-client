import { ApiResponse, InvoiceFilter, InvoiceResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useQuery } from "@tanstack/react-query";
import { isNumber } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useUserInvoice = () => {
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

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

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
      "invoice-tenant",
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

      const res = await httpRequest.get("/invoices/tenant", {
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
      toast.error("Có lỗi xảy ra khi tải hóa đơn");
    }
  }, [isError]);

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
    props,
    data,
    isLoading,
    rowSelection,
    setRowSelection,
  };
};
