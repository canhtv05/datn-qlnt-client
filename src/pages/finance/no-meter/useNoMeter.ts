import { ApiResponse, RoomNoMeterFilter, RoomNoMeterResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useQuery } from "@tanstack/react-query";
import { isNumber } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useNoMeter = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    status = "",
    roomType = "",
    maxPrice = "",
    minPrice = "",
    query = "",
  } = queryFilter(searchParams, "page", "size", "status", "roomType", "maxPrice", "minPrice", "query");

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<RoomNoMeterFilter>({
    maxPrice: isNumber(maxPrice) ? Number(maxPrice) : undefined,
    minPrice: isNumber(minPrice) ? Number(minPrice) : undefined,
    query,
    roomType,
    status,
  });

  const handleClear = () => {
    setFilterValues({
      maxPrice: undefined,
      minPrice: undefined,
      query: "",
      roomType: "",
      status: "",
    });
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

  const { data, isLoading, isError } = useQuery<ApiResponse<RoomNoMeterResponse[]>>({
    queryKey: ["no-meters", page, size, query, minPrice, maxPrice, roomType, status],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      Object.entries(filterValues).forEach(([k, v]) => {
        if (v) params[k] = v;
      });

      const res = await httpRequest.get("/meters/no-meter", {
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
      toast.error(t("meter.errorFetch"));
    }
  }, [isError, t]);

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      ...filterValues,
    },
    setSearchParams,
    props,
    data,
    isLoading,
  };
};
