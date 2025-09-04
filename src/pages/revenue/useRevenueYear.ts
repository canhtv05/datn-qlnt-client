import { ApiResponse, IdAndName, RevenueYearRequest, RevenueYearResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function useRevenueYear() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { year = "", buildingId = "" } = queryFilter(searchParams, "year", "buildingId");

  const [filterValues, setFilterValues] = useState<RevenueYearRequest>({
    buildingId,
    year: year && !isNaN(Number(year)) ? Number(year) : new Date().getFullYear(),
  });

  const handleClear = () => {
    setFilterValues({
      buildingId: "",
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

  const { data, isLoading, isError } = useQuery<ApiResponse<RevenueYearResponse>>({
    queryKey: ["revenue-year", buildingId, year],
    queryFn: async () => {
      const params: Record<string, string> = {};
      Object.entries(filterValues).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await httpRequest.get("/revenues/year", { params });
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
