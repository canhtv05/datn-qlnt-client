import { ApiResponse, BuildingResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface FilterValues {
  query: string;
  status: string;
  buildingType: string;
}

export const useBuilding = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    query = "",
    status = "",
    buildingType = "",
  } = queryFilter(searchParams, "page", "size", "query", "status", "buildingType");

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<FilterValues>({
    query,
    status,
    buildingType,
  });

  useEffect(() => {
    setFilterValues({ query, status, buildingType });
  }, [buildingType, query, status]);

  const handleClear = () => {
    setFilterValues({ query: "", status: "", buildingType: "" });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.query) params.set("query", filterValues.query);
    if (filterValues.status) params.set("status", filterValues.status);
    if (filterValues.buildingType) params.set("buildingType", filterValues.buildingType);
    params.set("page", "1");
    if (filterValues.status || filterValues.query || filterValues.buildingType) {
      setSearchParams(params);
    }
  }, [filterValues.buildingType, filterValues.query, filterValues.status, setSearchParams]);

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
  };

  const { data, isLoading } = useQuery<ApiResponse<BuildingResponse[]>>({
    queryKey: ["buildings", page, size, status, buildingType, query],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (status) params["status"] = status;
      if (buildingType) params["buildingType"] = buildingType;
      if (query) params["query"] = query;

      const res = await httpRequest.get("/buildings", {
        params,
      });

      return res.data;
    },
  });

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      query,
      status,
    },
    setSearchParams,
    props,
    data,
    isLoading,
  };
};
