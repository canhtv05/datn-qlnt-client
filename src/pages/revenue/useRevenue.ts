import { ApiResponse, IdAndName, RevenueComparisonResponse, RevenueStatisticRequest } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useQuery } from "@tanstack/react-query";
import { isNumber } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function useRevenue() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { month = "", year = "", buildingId = "" } = queryFilter(searchParams, "month", "year", "buildingId");

  const [filterValues, setFilterValues] = useState<RevenueStatisticRequest>({
    buildingId,
    month: isNumber(month) ? Number(month) : new Date().getMonth() + 1,
    year: isNumber(year) ? Number(year) : new Date().getFullYear(),
  });

  const handleClear = () => {
    setFilterValues({
      buildingId: "",
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  }, [filterValues, setSearchParams]);

  const { data, isLoading, isError } = useQuery<ApiResponse<RevenueComparisonResponse[]>>({
    queryKey: ["revenue-comparison", buildingId, month, year],
    queryFn: async () => {
      const params: Record<string, string> = {};
      Object.entries(filterValues).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await httpRequest.get("/revenues/comparison", { params });
      return res.data;
    },
    retry: 1,
  });

  const { data: building, isError: errorBuilding } = useQuery<ApiResponse<IdAndName[]>>({
    queryKey: ["building-revenue"],
    queryFn: async () => {
      const res = await httpRequest.get("/buildings/all");
      return res.data;
    },
    retry: false,
  });

  useEffect(() => {
    if (isError) {
      toast.error(t("revenue.loadError"));
    }
    if (errorBuilding) {
      toast.error(t("building.errorFetch"));
    }
  }, [errorBuilding, isError, t]);

  const buildingOptions = useMemo(() => {
    return (
      building?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      })) ?? []
    );
  }, [building?.data]);

  return {
    query: { ...filterValues },
    setSearchParams,
    props: {
      filterValues,
      setFilterValues,
      onClear: handleClear,
      onFilter: handleFilter,
      buildingOptions,
    },
    data,
    isLoading,
  };
}
