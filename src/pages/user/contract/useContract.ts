import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

import { ApiResponse, ContractResponse, ContractFilterValues } from "@/types";
import { VehicleType } from "@/enums";
import { queryFilter } from "@/utils/queryFilter";
import { httpRequest } from "@/utils/httpRequest";
import { useTranslation } from "react-i18next";
import { TFunction } from "i18next";

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

  const [filterValues, setFilterValues] = useState<ContractFilterValues>({
    query,
    status,
  });
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
    queryKey: ["my-contracts", page, size, query, status],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: parsedPage.toString(),
        size: parsedSize.toString(),
      };
      Object.entries(filterValues).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await httpRequest.get("/contracts/my-contracts", { params });
      return res.data;
    },
    retry: 1,
  });
  useEffect(() => {
    if (isError) toast.error(t("contract.errorFetch"));
  }, [isError, t]);

  const handleActionClick = useCallback(
    (contract: ContractResponse) => {
      navigate(`/contracts/${contract.id}`);
    },
    [navigate]
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
    handleActionClick,
  };
};
