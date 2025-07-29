import { StatisticCardType } from "@/components/StatisticCard";
import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { updateServiceRoomSchema } from "@/lib/validation";
import {
  ApiResponse,
  CreateRoomServiceInitResponse,
  ServiceRoomFilter,
  ServiceRoomResponse,
  ServiceRoomStatistics,
  ServiceRoomUpdateRequest,
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

export const useServiceRoom = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    query = "",
    minPrice = "",
    maxPrice = "",
    status = "",
  } = queryFilter(searchParams, "page", "size", "query", "minPrice", "maxPrice", "status");

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<ServiceRoomUpdateRequest>({
    descriptionServiceRoom: "",
    roomId: "",
    serviceId: "",
    startDate: "",
    serviceRoomStatus: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ServiceRoomUpdateRequest>();

  const [filterValues, setFilterValues] = useState<ServiceRoomFilter>({
    maxPrice: isNumber(maxPrice) ? Number(maxPrice) : undefined,
    minPrice: isNumber(minPrice) ? Number(minPrice) : undefined,
    query,
    status,
  });

  const handleClear = () => {
    setFilterValues({
      maxPrice: undefined,
      minPrice: undefined,
      query: "",
      status: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.maxPrice) params.set("maxPrice", filterValues.maxPrice.toString());
    if (filterValues.minPrice) params.set("minPrice", filterValues.minPrice.toString());
    if (filterValues.query) params.set("query", filterValues.query);
    if (filterValues.status) params.set("status", filterValues.status);
    params.set("page", "1");
    if (filterValues.maxPrice || filterValues.minPrice || filterValues.query || filterValues.status) {
      setSearchParams(params);
    }
  }, [filterValues.maxPrice, filterValues.minPrice, filterValues.query, filterValues.status, setSearchParams]);

  const { data, isLoading, isError } = useQuery<ApiResponse<ServiceRoomResponse[]>>({
    queryKey: ["service-rooms", page, size, maxPrice, minPrice, query, status],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (maxPrice) params["maxPrice"] = maxPrice;
      if (minPrice) params["minPrice"] = minPrice;
      if (query) params["query"] = query;
      if (status) params["status"] = status;

      const res = await httpRequest.get("/service-rooms");

      // console.log("Service Rooms Data:", res.data);

      return res.data;
    },
  });


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateServiceRoomMutation = useMutation({
    mutationKey: ["update-service-room"],
    mutationFn: async (payload: ServiceRoomUpdateRequest) =>
      await httpRequest.put(`/service-rooms/${idRef.current}`, payload),
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const removeServiceRoomMutation = useMutation({
    mutationKey: ["remove-service-rooms"],
    mutationFn: async (id: string) => await httpRequest.put(`/service-rooms/soft-delete/${id}`),
  });

  const toggleStatusServiceRoomMutation = useMutation({
    mutationKey: ["toggle-service-room"],
    mutationFn: async (id: string) => await httpRequest.put(`/service-rooms/toggle-status/${id}`),
  });

  const handleToggleStatusServiceRoomById = async (id: string): Promise<boolean> => {
    try {
      await toggleStatusServiceRoomMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms",
          });
          queryClient.invalidateQueries({ queryKey: ["service-rooms-statistics"] });

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
      if (type === "delete") return await handleRemoveServiceRoomById(id);
      if (type === "status") return await handleToggleStatusServiceRoomById(id);
      return false;
    },
  });

  const handleRemoveServiceRoomById = async (id: string): Promise<boolean> => {
    try {
      await removeServiceRoomMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms",
          });
          queryClient.invalidateQueries({ queryKey: ["service-rooms-statistics"] });
          toast.success(Status.REMOVE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleUpdateServiceRoom = useCallback(async () => {
    try {
      const { descriptionServiceRoom, roomId, serviceId, startDate, serviceRoomStatus } = value;

      const data: ServiceRoomUpdateRequest = {
        descriptionServiceRoom: descriptionServiceRoom.trim(),
        roomId: roomId ?? "",
        serviceId: serviceId ?? "",
        serviceRoomStatus,
        startDate,
      };

      await updateServiceRoomSchema.parseAsync(data);

      updateServiceRoomMutation.mutate(data, {
        onSuccess: () => {
          setValue({
            descriptionServiceRoom: "",
            roomId: "",
            serviceId: "",
            serviceRoomStatus: "",
            startDate: "",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms",
          });
          queryClient.invalidateQueries({ queryKey: ["service-rooms-statistics"] });
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
  }, [updateServiceRoomMutation, clearErrors, handleZodErrors, queryClient, value]);

  const handleActionClick = useCallback(
    (serviceRoom: ServiceRoomResponse, action: "update" | "delete" | "status") => {
      idRef.current = serviceRoom.id;
      if (action === "update") {
        setValue({
          descriptionServiceRoom: serviceRoom.descriptionServiceRoom,
          roomId: serviceRoom.roomId,
          serviceId: serviceRoom.serviceId,
          serviceRoomStatus: serviceRoom.serviceRoomStatus,
          startDate: serviceRoom.startDate,
        });
        setIsModalOpen(true);
      } else {
        openDialog(
          { id: serviceRoom.id, type: action },
          {
            type: "warn",
            desc: action === "delete" ? Notice.REMOVE : Notice.TOGGLE_STATUS,
          }
        );
      }
    },
    [openDialog]
  );

  const { data: serviceRoomInit, isError: isErrorServiceRoom } = useQuery<ApiResponse<CreateRoomServiceInitResponse>>({
    queryKey: ["room-services-init"],
    queryFn: async () => {
      const res = await httpRequest.get("/service-rooms/init");
      return res.data;
    },
    retry: 1,
  });

  const { data: statistics, isError: isStatisticsError } = useQuery<ApiResponse<ServiceRoomStatistics>>({
    queryKey: ["service-rooms-statistics"],
    queryFn: async () => {
      const res = await httpRequest.get("/service-rooms/statistics");
      return res.data;
    },
    retry: 1,
  });

  const dataServices: StatisticCardType[] = [
    {
      icon: Puzzle,
      label: "Tổng tài sản",
      value: statistics?.data.total ?? 0,
    },
    {
      icon: CircleCheck,
      label: "Hoạt động",
      value: statistics?.data.active ?? 0,
    },
    {
      icon: XCircle,
      label: "Không hoạt động",
      value: statistics?.data.paused ?? 0,
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
      toast.error("Có lỗi xảy ra khi tải dịch vụ sản phòng");
    }

    if (isErrorServiceRoom) {
      toast.error("Không lấy được dữ liệu phòng và dịch vụ");
    }

    if (isStatisticsError) {
      toast.error("Không lấy được dữ liệu thống kê");
    }
  }, [isError, isErrorServiceRoom, isStatisticsError]);

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      query,
      minPrice,
      maxPrice,
      status,
    },
    setSearchParams,
    serviceRoomInit,
    dataServices,
    props,
    data,
    isLoading,
    handleActionClick,
    rowSelection,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    handleUpdateFloor: handleUpdateServiceRoom,
    value,
    setValue,
    errors,
    ConfirmDialog,
  };
};
