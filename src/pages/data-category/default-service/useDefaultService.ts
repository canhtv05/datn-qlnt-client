import { StatisticCardType } from "@/components/StatisticCard";
import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { updateDefaultServiceSchema } from "@/lib/validation";
import {
  ApiResponse,
  DefaultServiceFilter,
  DefaultServiceInitResponse,
  DefaultServiceResponse,
  DefaultServiceStatistics,
  DefaultServiceUpdateRequest,
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

export const useDefaultService = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    buildingId = "",
    floorId = "",
    serviceId = "",
    defaultServiceStatus = "",
    defaultServiceAppliesTo = "",
    minPricesApply = "",
    maxPricesApply = "",
  } = queryFilter(
    searchParams,
    "page",
    "size",
    "buildingId",
    "floorId",
    "serviceId",
    "defaultServiceStatus",
    "defaultServiceAppliesTo",
    "minPricesApply",
    "maxPricesApply"
  );

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<DefaultServiceUpdateRequest>({
    defaultServiceAppliesTo: "",
    defaultServiceStatus: "",
    description: "",
    pricesApply: undefined,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const { clearErrors, errors, handleZodErrors } = useFormErrors<DefaultServiceUpdateRequest>();

  const [filterValues, setFilterValues] = useState<DefaultServiceFilter>({
    buildingId,
    defaultServiceAppliesTo,
    defaultServiceStatus,
    floorId,
    maxPricesApply: isNumber(maxPricesApply) ? Number(maxPricesApply) : undefined,
    minPricesApply: isNumber(minPricesApply) ? Number(minPricesApply) : undefined,
    serviceId,
  });

  const handleClear = () => {
    setFilterValues({
      buildingId: "",
      defaultServiceAppliesTo: "",
      defaultServiceStatus: "",
      floorId: "",
      maxPricesApply: undefined,
      minPricesApply: undefined,
      serviceId: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.buildingId) params.set("buildingId", filterValues.buildingId);
    if (filterValues.defaultServiceAppliesTo)
      params.set("defaultServiceAppliesTo", filterValues.defaultServiceAppliesTo);
    if (filterValues.defaultServiceStatus) params.set("defaultServiceStatus", filterValues.defaultServiceStatus);
    if (filterValues.floorId) params.set("floorId", filterValues.floorId);
    if (filterValues.maxPricesApply) params.set("maxPricesApply", filterValues.maxPricesApply.toString());
    if (filterValues.minPricesApply) params.set("minPricesApply", filterValues.minPricesApply.toString());
    if (filterValues.serviceId) params.set("serviceId", filterValues.serviceId.toString());
    params.set("page", "1");
    if (
      filterValues.buildingId ||
      filterValues.defaultServiceAppliesTo ||
      filterValues.defaultServiceStatus ||
      filterValues.floorId ||
      filterValues.maxPricesApply ||
      filterValues.minPricesApply ||
      filterValues.serviceId
    ) {
      setSearchParams(params);
    }
  }, [
    filterValues.buildingId,
    filterValues.defaultServiceAppliesTo,
    filterValues.defaultServiceStatus,
    filterValues.floorId,
    filterValues.maxPricesApply,
    filterValues.minPricesApply,
    filterValues.serviceId,
    setSearchParams,
  ]);

  const { data, isLoading, isError } = useQuery<ApiResponse<DefaultServiceResponse[]>>({
    queryKey: [
      "default-services",
      page,
      size,
      buildingId,
      defaultServiceAppliesTo,
      defaultServiceStatus,
      floorId,
      maxPricesApply,
      minPricesApply,
      serviceId,
    ],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (buildingId) params["buildingId"] = buildingId;
      if (defaultServiceAppliesTo) params["defaultServiceAppliesTo"] = defaultServiceAppliesTo;
      if (defaultServiceStatus) params["defaultServiceStatus"] = defaultServiceStatus;
      if (floorId) params["floorId"] = floorId;
      if (maxPricesApply) params["maxPricesApply"] = maxPricesApply;
      if (minPricesApply) params["minPricesApply"] = minPricesApply;
      if (serviceId) params["serviceId"] = serviceId;

      const res = await httpRequest.get("/default-services", {
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

  const updateDefaultServiceMutation = useMutation({
    mutationKey: ["update-default-service"],
    mutationFn: async (payload: DefaultServiceUpdateRequest) =>
      await httpRequest.put(`/default-services/${idRef.current}`, payload),
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const removeDefaultServiceMutation = useMutation({
    mutationKey: ["remove-default-service"],
    mutationFn: async (id: string) => await httpRequest.delete(`/default-services/${id}`),
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" | "status" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "delete") return await handleRemoveDefaultServicesById(id);
      if (type === "status") return await handleToggleStatusDefaultServiceById(id);
      return false;
    },
  });

  const handleRemoveDefaultServicesById = async (id: string): Promise<boolean> => {
    try {
      await removeDefaultServiceMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "default-services",
          });
          queryClient.invalidateQueries({ queryKey: ["default-services-statistics"] });
          toast.success(Status.REMOVE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const toggleStatusDefaultServiceMutation = useMutation({
    mutationKey: ["toggle-default-service"],
    mutationFn: async (id: string) => await httpRequest.put(`/default-services/toggle-status/${id}`),
  });

  const handleToggleStatusDefaultServiceById = async (id: string): Promise<boolean> => {
    try {
      await toggleStatusDefaultServiceMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "default-services",
          });
          queryClient.invalidateQueries({ queryKey: ["default-services-statistics"] });

          toast.success(Status.UPDATE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleUpdateDefaultService = useCallback(async () => {
    try {
      const { defaultServiceAppliesTo, defaultServiceStatus, description, pricesApply } = value;

      await updateDefaultServiceSchema.parseAsync(value);

      const data: DefaultServiceUpdateRequest = {
        defaultServiceAppliesTo,
        defaultServiceStatus,
        description: description.trim(),
        pricesApply,
      };

      updateDefaultServiceMutation.mutate(data, {
        onSuccess: () => {
          setValue({
            defaultServiceAppliesTo: "",
            defaultServiceStatus: "",
            description: "",
            pricesApply: undefined,
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "default-services",
          });
          queryClient.invalidateQueries({ queryKey: ["default-services-statistics"] });
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
  }, [updateDefaultServiceMutation, clearErrors, handleZodErrors, queryClient, value]);

  const handleActionClick = useCallback(
    (defaultServices: DefaultServiceResponse, action: "update" | "delete") => {
      idRef.current = defaultServices.id;
      if (action === "update") {
        setValue({
          defaultServiceAppliesTo: defaultServices.defaultServiceAppliesTo,
          defaultServiceStatus: defaultServices.defaultServiceStatus,
          description: defaultServices.description,
          pricesApply: defaultServices.pricesApply,
        });
        setIsModalOpen(true);
      } else {
        openDialog(
          { id: defaultServices.id, type: action },
          {
            type: "warn",
            desc: action === "delete" ? Notice.REMOVE : Notice.TOGGLE_STATUS,
          }
        );
      }
    },
    [openDialog]
  );

  const { data: defaultServiceInit, isError: errorServiceInit } = useQuery<ApiResponse<DefaultServiceInitResponse>>({
    queryKey: ["default-services-init"],
    queryFn: async () => {
      const res = await httpRequest.get("/default-services/init");
      return res.data;
    },
    retry: 1,
  });

  const { data: statistics, isError: isStatisticsError } = useQuery<ApiResponse<DefaultServiceStatistics>>({
    queryKey: ["default-services-statistics"],
    queryFn: async () => {
      const res = await httpRequest.get("/default-services/statistics");
      return res.data;
    },
    retry: 1,
  });

  const dataDefaultServices: StatisticCardType[] = [
    {
      icon: Puzzle,
      label: "Dịch vụ",
      value: statistics?.data.totalDefaultServices ?? 0,
    },
    {
      icon: CircleCheck,
      label: "Hoạt động",
      value: statistics?.data.activeDefaultServices ?? 0,
    },
    {
      icon: XCircle,
      label: "Không hoạt động",
      value: statistics?.data.inactiveDefaultServices ?? 0,
    },
  ];

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
    defaultServiceInit,
  };

  useEffect(() => {
    if (isError) {
      toast.error("Có lỗi xảy ra khi tải dịch vụ mặc định");
    }

    if (errorServiceInit) {
      toast.error("Có lỗi xảy ra khi tải khởi tạo dịch vụ mặc định");
    }

    if (isStatisticsError) {
      toast.error("Có lỗi xảy ra khi tải thống kê dịch vụ mặc định");
    }
  }, [errorServiceInit, isError, isStatisticsError]);

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      buildingId,
      serviceId,
      floorId,
      defaultServiceStatus,
      defaultServiceAppliesTo,
      minPricesApply,
      maxPricesApply,
    },
    setSearchParams,
    props,
    data,
    isLoading,
    handleActionClick,
    rowSelection,
    defaultServiceInit,
    dataDefaultServices,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    handleUpdateFloor: handleUpdateDefaultService,
    value,
    setValue,
    errors,
    ConfirmDialog,
  };
};
