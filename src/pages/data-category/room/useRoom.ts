import { useConfirmDialog, useFormErrors } from "@/hooks";
import { createOrUpdateRoomSchema } from "@/lib/validation";
import {
  ApiResponse,
  RoomFormValue,
  RoomResponse,
  IRoomStatisticsResponse,
  FloorBasicResponse,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect, useCallback, ChangeEvent } from "react";
import { toast } from "sonner";
import { Status, Notice } from "@/enums";
import { useParams, useSearchParams } from "react-router-dom";
import { Building2, HandCoins, DoorOpen } from "lucide-react";

interface FilterValues {
  query: string;
  status: string;
  roomType: string;
}

const mapStatistics = (data?: IRoomStatisticsResponse) => ({
  renting: data?.getTotalDangThue ?? 0,
  depositing: data?.getTotalDaDatCoc ?? 0,
  empty: data?.getTotalTrong ?? 0,
});

export const useRoom = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    query = "",
    status = "",
    roomType = "",
  } = queryFilter(searchParams, "page", "size", "query", "status", "roomType");

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const {id: buildingId} = useParams();
  console.log(" buildingId:", buildingId);
  const idRef = useRef<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [value, setValue] = useState<RoomFormValue>({
    floorId: "",
    acreage: null,
    price: null,
    maximumPeople: null,
    roomType: null,
    status: null,
    description: "",
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<RoomFormValue>();

  const [filterValues, setFilterValues] = useState<FilterValues>({
    query,
    status,
    roomType,
  });

  useEffect(() => {
    setFilterValues({ query, status, roomType });
  }, [query, status, roomType]);

  const handleClear = () => {
    setFilterValues({ query: "", status: "", roomType: "" });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.query) params.set("query", filterValues.query);
    if (filterValues.status) params.set("status", filterValues.status);
    if (filterValues.roomType) params.set("roomType", filterValues.roomType);
    params.set("page", "1");
    setSearchParams(params);
  }, [filterValues, setSearchParams]);

  // Get room data
  const {
    data: roomData,
    isLoading,
    isError: isRoomError,
  } = useQuery<ApiResponse<RoomResponse[]>>({
    queryKey: ["rooms", page, size, status, roomType, query, buildingId],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: parsedPage.toString(),
        size: parsedSize.toString(),
        buildingId: buildingId ?? "",
      };
      if (status) params.status = status;
      if (roomType) params.roomType = roomType;
      if (query) params.query = query;
      const res = await httpRequest.get("/rooms", { params });
      return res.data;
    },
  });

  useEffect(() => {
    if (isRoomError) {
      toast.error("Không thể tải dữ liệu phòng. Vui lòng thử lại sau.");
    }
  }, [isRoomError]);

  const { data: floorListData, isLoading: isLoadingFloorList } =
    useQuery<ApiResponse<FloorBasicResponse[]>>({
      queryKey: ["floor-list", buildingId],
      queryFn: async () => {
        const res = await httpRequest.get("/floors/find-all", {
          params: {
            buildingId,
          },
        });
        return res.data;
      },
      enabled: !!buildingId,
    });

  const { data: statisticsRaw } = useQuery<ApiResponse<IRoomStatisticsResponse>>({
  queryKey: ["room-statistics", buildingId],
  queryFn: async () =>
    (await httpRequest.get("/rooms/statistics", {
      params: { buildingId },
    })).data,
  enabled: !!buildingId,
});


  const roomStats = [
    { icon: DoorOpen, label: "Đang trống", value: mapStatistics(statisticsRaw?.data).empty },
    { icon: HandCoins, label: "Đang đặt cọc", value: mapStatistics(statisticsRaw?.data).depositing },
    { icon: Building2, label: "Đang thuê", value: mapStatistics(statisticsRaw?.data).renting },
  ];

  const createRoomMutation = useMutation({
    mutationKey: ["create-room"],
    mutationFn: async (payload: RoomFormValue) =>
      httpRequest.post("/rooms/add", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-statistics"] });
      toast.success(Status.ADD_SUCCESS);
    },
    onError: handleMutationError,
  });

  const updateRoomMutation = useMutation({
    mutationKey: ["update-room"],
    mutationFn: async (payload: RoomFormValue) =>
      httpRequest.put(`/rooms/update/${idRef.current}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-statistics"] });
      toast.success(Status.UPDATE_SUCCESS);
    },
    onError: handleMutationError,
  });

  const deleteRoomMutation = useMutation({
    mutationKey: ["delete-room"],
    mutationFn: async (id: string) => httpRequest.delete(`/rooms/delete/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-statistics"] });
      toast.success(Status.REMOVE_SUCCESS);
    },
    onError: handleMutationError,
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string }>({
    onConfirm: async ({ id }) => {
      try {
        await deleteRoomMutation.mutateAsync(id);
        return true;
      } catch {
        return false;
      }
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = useCallback(() => {
    setValue({
      floorId: "",
      acreage: null,
      price: null,
      maximumPeople: null,
      roomType: null,
      status: null,
      description: "",
    });
    idRef.current = "";
    clearErrors();
  }, [clearErrors]);

  const handleSaveRoom = useCallback(async () => {
    try {
      await createOrUpdateRoomSchema.parseAsync(value);
    console.error("Validation error:", value);
      if (idRef.current) {
        await updateRoomMutation.mutateAsync(value);
      } else {
        await createRoomMutation.mutateAsync(value);
      }
      resetForm();
      setIsModalOpen(false);
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [value, resetForm, updateRoomMutation, createRoomMutation, handleZodErrors]);

  const handleActionClick = (room: RoomResponse, type: "update" | "delete") => {
    if (type === "update") {
      idRef.current = room.id;
      setValue({
        floorId: room.floor.id,
        acreage: room.acreage,
        price: room.price,
        maximumPeople: room.maximumPeople,
        roomType: room.roomType,
        status: room.status,
        description: room.description,
      });
      setIsModalOpen(true);
    } else {
      openDialog({ id: room.id }, { type: "warn", desc: Notice.REMOVE });
    }
  };

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
  };

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      query,
      status,
    },
    setSearchParams,
    props,
    data: roomData,
    isLoading,
    statistics: roomStats ?? [],
    value,
    setValue,
    handleChange,
    handleSaveRoom,
    isModalOpen,
    setIsModalOpen,
    errors,
    handleActionClick,
    ConfirmDialog,
    rowSelection,
    setRowSelection,
    floorList: floorListData?.data ?? [],
    isLoadingFloorList,
  };
};
