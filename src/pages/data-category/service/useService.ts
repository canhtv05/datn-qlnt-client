import { StatisticCardType } from "@/components/StatisticCard";
import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { createOrUpdateService } from "@/lib/validation";
import {
  ApiResponse,
  ServiceCountResponse,
  ServiceCreationRequest,
  ServiceFilter,
  ServiceResponse,
  ServiceUpdateRequest,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isNumber } from "lodash";
import { CircleCheck, Puzzle, XCircle } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useAssetType = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    query = "",
    serviceCategory = "",
    minPrice = "",
    maxPrice = "",
    serviceStatus = "",
    serviceCalculation = "",
  } = queryFilter(
    searchParams,
    "page",
    "size",
    "query",
    "serviceCategory",
    "minPrice",
    "maxPrice",
    "serviceStatus",
    "serviceCalculation"
  );

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<ServiceUpdateRequest>({
    description: "",
    name: "",
    price: undefined,
    serviceCalculation: "",
    serviceCategory: "",
    status: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ServiceUpdateRequest>();

  const [filterValues, setFilterValues] = useState<ServiceFilter>({
    maxPrice: isNumber(maxPrice) ? Number(maxPrice) : undefined,
    minPrice: isNumber(minPrice) ? Number(minPrice) : undefined,
    query,
    serviceStatus,
    serviceCalculation,
    serviceCategory,
  });

  const handleClear = () => {
    setFilterValues({
      maxPrice: undefined,
      minPrice: undefined,
      query: "",
      serviceStatus: "",
      serviceCalculation: "",
      serviceCategory: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.maxPrice) params.set("maxPrice", filterValues.maxPrice.toString());
    if (filterValues.minPrice) params.set("minPrice", filterValues.minPrice.toString());
    if (filterValues.query) params.set("query", filterValues.query);
    if (filterValues.serviceCalculation)
      params.set("serviceCalculation", filterValues.serviceCalculation);
    if (filterValues.serviceStatus) params.set("serviceStatus", filterValues.serviceStatus);
    if (filterValues.serviceCategory) params.set("serviceCategory", filterValues.serviceCategory);
    params.set("page", "1");
    if (
      filterValues.maxPrice ||
      filterValues.minPrice ||
      filterValues.query ||
      filterValues.serviceCalculation ||
      filterValues.serviceStatus ||
      filterValues.serviceCategory
    ) {
      setSearchParams(params);
    }
  }, [
    filterValues.maxPrice,
    filterValues.minPrice,
    filterValues.query,
    filterValues.serviceCalculation,
    filterValues.serviceCategory,
    filterValues.serviceStatus,
    setSearchParams,
  ]);

  const { data, isLoading, isError } = useQuery<ApiResponse<ServiceResponse[]>>({
    queryKey: [
      "service",
      page,
      size,
      minPrice,
      maxPrice,
      query,
      serviceCalculation,
      serviceStatus,
      serviceCalculation,
    ],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (maxPrice) params["maxPrice"] = maxPrice;
      if (minPrice) params["minPrice"] = minPrice;
      if (query) params["query"] = query;
      if (serviceCalculation) params["serviceCalculation"] = serviceCalculation;
      if (serviceStatus) params["serviceStatus"] = serviceStatus;
      if (serviceCategory) params["serviceCategory"] = serviceCategory;

      const res = await httpRequest.get("/services", {
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

  const updateServiceMutation = useMutation({
    mutationKey: ["update-service"],
    mutationFn: async (payload: ServiceCreationRequest) =>
      await httpRequest.put(`/services/update/${idRef.current}`, payload),
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const removeServiceMutation = useMutation({
    mutationKey: ["remove-services"],
    mutationFn: async (id: string) => await httpRequest.put(`/services/soft-delete/${id}`),
  });

  const toggleStatusServiceMutation = useMutation({
    mutationKey: ["toggle-service"],
    mutationFn: async (id: string) => await httpRequest.put(`/services/toggle-status/${id}`),
  });

  const handleToggleStatusServiceById = async (id: string): Promise<boolean> => {
    try {
      await toggleStatusServiceMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service",
          });
          queryClient.invalidateQueries({ queryKey: ["service-statistics"] });
          toast.success(t(Status.UPDATE_SUCCESS));
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" | "status" }>(
    {
      onConfirm: async ({ id, type }) => {
        if (type === "delete") return await handleRemoveServicesById(id);
        if (type === "status") return await handleToggleStatusServiceById(id);
        return false;
      },
    }
  );

  const handleRemoveServicesById = async (id: string): Promise<boolean> => {
    try {
      await removeServiceMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service",
          });
          queryClient.invalidateQueries({ queryKey: ["service-statistics"] });
          toast.success(t(Status.REMOVE_SUCCESS));
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleUpdateFloor = useCallback(async () => {
    try {
      const { description, name, price, status, serviceCalculation, serviceCategory } = value;

      await createOrUpdateService.parseAsync(value);

      const data: ServiceUpdateRequest = {
        description: description.trim(),
        name: name.trim(),
        price,
        serviceCalculation,
        serviceCategory,
        status,
      };

      updateServiceMutation.mutate(data, {
        onSuccess: () => {
          setValue({
            description: "",
            name: "",
            price: undefined,
            serviceCalculation,
            serviceCategory,
            status: "",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service",
          });
          queryClient.invalidateQueries({ queryKey: ["service-statistics"] });
          toast.success(t(Status.UPDATE_SUCCESS));
          setIsModalOpen(false);
        },
      });
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [value, updateServiceMutation, clearErrors, queryClient, t, handleZodErrors]);

  const handleActionClick = useCallback(
    (service: ServiceResponse, action: "update") => {
      idRef.current = service.id;
      if (action === "update") {
        setValue({
          serviceCalculation: service.serviceCalculation,
          description: service.description,
          name: service.name,
          price: service.price,
          serviceCategory: service.serviceCategory,
          status: service.status,
        });
        setIsModalOpen(true);
      } else {
        openDialog(
          { id: service.id, type: action },
          {
            type: "warn",
            desc: action === "delete" ? t(Notice.REMOVE) : t(Notice.TOGGLE_STATUS),
          }
        );
      }
    },
    [openDialog, t]
  );

  const { data: statistics, isError: isStatisticsError } = useQuery<
    ApiResponse<ServiceCountResponse>
  >({
    queryKey: ["service-statistics"],
    queryFn: async () => {
      const res = await httpRequest.get("/services/statistics");
      return res.data;
    },
    retry: 1,
  });

  const dataServices: StatisticCardType[] = [
    {
      icon: Puzzle,
      label: t("service.title"),
      value: statistics?.data.getTotal ?? 0,
    },
    {
      icon: CircleCheck,
      label: t("statusBadge.serviceStatus.active"),
      value: statistics?.data.getTotalHoatDong ?? 0,
    },
    {
      icon: XCircle,
      label: t("statusBadge.serviceStatus.inactive"),
      value: statistics?.data.getTotalKhongHoatDong ?? 0,
    },
  ];

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
  };

  useEffect(() => {
    if (isError) {
      toast.error(t("service.errorFetch"));
    }

    if (isStatisticsError) {
      toast.error(t("service.errorFetchStatistics"));
    }
  }, [isError, isStatisticsError, t]);

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      minPrice,
      maxPrice,
      query,
      serviceCategory,
      serviceCalculation,
      serviceStatus,
    },
    setSearchParams,
    props,
    data,
    isLoading,
    dataServices,
    handleActionClick,
    rowSelection,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    handleUpdateFloor,
    value,
    setValue,
    errors,
    ConfirmDialog,
  };
};
