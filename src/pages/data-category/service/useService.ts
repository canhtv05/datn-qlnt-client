import { StatisticCardType } from "@/components/StatisticCard";
import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { createOrUpdateService } from "@/lib/validation";
import {
  ApiResponse,
  ServiceCountResponse,
  ServiceCreationAndUpdateRequest,
  ServiceFilter,
  ServiceResponse,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isNumber } from "lodash";
import { CircleCheck, Puzzle, XCircle } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useAssetType = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    query = "",
    serviceType = "",
    minPrice = "",
    maxPrice = "",
    serviceStatus = "",
    serviceAppliedBy = "",
  } = queryFilter(
    searchParams,
    "page",
    "size",
    "query",
    "serviceType",
    "minPrice",
    "maxPrice",
    "serviceStatus",
    "serviceAppliedBy"
  );

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<ServiceCreationAndUpdateRequest>({
    appliedBy: "",
    description: "",
    name: "",
    price: undefined,
    status: "",
    type: "",
    unit: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ServiceCreationAndUpdateRequest>();

  const [filterValues, setFilterValues] = useState<ServiceFilter>({
    maxPrice: isNumber(maxPrice) ? Number(maxPrice) : undefined,
    minPrice: isNumber(minPrice) ? Number(minPrice) : undefined,
    query,
    serviceAppliedBy,
    serviceStatus,
    serviceType,
  });

  const handleClear = () => {
    setFilterValues({
      maxPrice: undefined,
      minPrice: undefined,
      query: "",
      serviceAppliedBy: "",
      serviceStatus: "",
      serviceType: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.maxPrice) params.set("maxPrice", filterValues.maxPrice.toString());
    if (filterValues.minPrice) params.set("minPrice", filterValues.minPrice.toString());
    if (filterValues.query) params.set("query", filterValues.query);
    if (filterValues.serviceAppliedBy) params.set("serviceAppliedBy", filterValues.serviceAppliedBy);
    if (filterValues.serviceStatus) params.set("serviceStatus", filterValues.serviceStatus);
    if (filterValues.serviceType) params.set("serviceType", filterValues.serviceType);
    params.set("page", "1");
    if (
      filterValues.maxPrice ||
      filterValues.minPrice ||
      filterValues.query ||
      filterValues.serviceAppliedBy ||
      filterValues.serviceStatus ||
      filterValues.serviceType
    ) {
      setSearchParams(params);
    }
  }, [
    filterValues.maxPrice,
    filterValues.minPrice,
    filterValues.query,
    filterValues.serviceAppliedBy,
    filterValues.serviceStatus,
    filterValues.serviceType,
    setSearchParams,
  ]);

  const { data, isLoading, isError } = useQuery<ApiResponse<ServiceResponse[]>>({
    queryKey: ["service", page, size, minPrice, maxPrice, query, serviceAppliedBy, serviceStatus, serviceType],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (maxPrice) params["maxPrice"] = maxPrice;
      if (minPrice) params["minPrice"] = minPrice;
      if (query) params["query"] = query;
      if (serviceAppliedBy) params["serviceAppliedBy"] = serviceAppliedBy;
      if (serviceStatus) params["serviceStatus"] = serviceStatus;
      if (serviceType) params["serviceType"] = serviceType;

      const res = await httpRequest.get("/service", {
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
    mutationFn: async (payload: ServiceCreationAndUpdateRequest) =>
      await httpRequest.put(`/service/update/${idRef.current}`, payload),
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const removeServiceMutation = useMutation({
    mutationKey: ["remove-services"],
    mutationFn: async (id: string) => await httpRequest.put(`/service/soft-delete/${id}`),
  });

  const toggleStatusServiceMutation = useMutation({
    mutationKey: ["toggle-service"],
    mutationFn: async (id: string) => await httpRequest.put(`/service/toggle-status/${id}`),
  });

  const handleToggleStatusServiceById = async (id: string): Promise<boolean> => {
    try {
      await toggleStatusServiceMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service",
          });
          queryClient.invalidateQueries({ queryKey: ["service-statistics"] });
          toast.success(Status.UPDATE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" | "status" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "delete") return await handleRemoveServicesById(id);
      if (type === "status") return await handleToggleStatusServiceById(id);
      return false;
    },
  });

  const handleRemoveServicesById = async (id: string): Promise<boolean> => {
    try {
      await removeServiceMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service",
          });
          queryClient.invalidateQueries({ queryKey: ["service-statistics"] });
          toast.success(Status.REMOVE_SUCCESS);
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
      const { appliedBy, description, name, price, status, type, unit } = value;

      await createOrUpdateService.parseAsync(value);

      const data: ServiceCreationAndUpdateRequest = {
        appliedBy,
        description: description.trim(),
        name: name.trim(),
        price,
        status,
        type,
        unit: unit.trim(),
      };

      updateServiceMutation.mutate(data, {
        onSuccess: () => {
          setValue({
            appliedBy: "",
            description: "",
            name: "",
            price: undefined,
            status: "",
            type: "",
            unit: "",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service",
          });
          queryClient.invalidateQueries({ queryKey: ["service-statistics"] });
          toast.success(Status.UPDATE_SUCCESS);
          setIsModalOpen(false);
        },
      });
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [updateServiceMutation, clearErrors, handleZodErrors, queryClient, value]);

  const handleActionClick = useCallback(
    (service: ServiceResponse, action: "update") => {
      idRef.current = service.id;
      if (action === "update") {
        setValue({
          appliedBy: service.appliedBy,
          description: service.description,
          name: service.name,
          price: service.price,
          status: service.status,
          type: service.type,
          unit: service.unit,
        });
        setIsModalOpen(true);
      } else {
        openDialog(
          { id: service.id, type: action },
          {
            type: "warn",
            desc: action === "delete" ? Notice.REMOVE : Notice.TOGGLE_STATUS,
          }
        );
      }
    },
    [openDialog]
  );

  const { data: statistics, isError: isStatisticsError } = useQuery<ApiResponse<ServiceCountResponse>>({
    queryKey: ["service-statistics"],
    queryFn: async () => {
      const res = await httpRequest.get("/service/statistics");
      return res.data;
    },
    retry: 1,
  });

  const dataServices: StatisticCardType[] = [
    {
      icon: Puzzle,
      label: "Dịch vụ",
      value: statistics?.data.getTotal ?? 0,
    },
    {
      icon: CircleCheck,
      label: "Hoạt động",
      value: statistics?.data.getTotalHoatDong ?? 0,
    },
    {
      icon: XCircle,
      label: "Không hoạt động",
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
      toast.error("Có lỗi xảy ra khi tải dịch vụ");
    }

    if (isStatisticsError) {
      toast.error("Có lỗi xảy ra khi tải thống kê dịch vụ");
    }
  }, [isError, isStatisticsError]);

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      minPrice,
      maxPrice,
      query,
      serviceType,
      serviceAppliedBy,
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
