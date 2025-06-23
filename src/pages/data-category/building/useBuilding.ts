import { ApiResponse, BuildingResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

interface FilterValues {
  search: string;
  status: string;
}

export const useBuilding = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    buildingCode = "",
    address = "",
    status = "",
  } = queryFilter(searchParams, "page", "size", "buildingCode", "address", "status");

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: buildingCode,
    status: status,
  });

  useEffect(() => {
    setFilterValues({ search: buildingCode, status });
  }, [buildingCode, status]);

  const handleClear = () => {
    setFilterValues({ search: "", status: "" });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.search) params.set("buildingCode", filterValues.search);
    if (filterValues.status) params.set("status", filterValues.status);
    params.set("page", "1");
    if (filterValues.status || filterValues.search) {
      setSearchParams(params);
    }
  }, [filterValues.search, filterValues.status, setSearchParams]);

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
  };

  const { data, isLoading } = useQuery<ApiResponse<BuildingResponse[]>>({
    queryKey: ["buildings", page, size, buildingCode, address, status],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (buildingCode) params["buildingCode"] = buildingCode;
      if (address) params["address"] = address;
      if (status) params["status"] = status;

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
      buildingCode,
      address,
      status,
    },
    setSearchParams,
    props,
    data,
    isLoading,
  };
};
