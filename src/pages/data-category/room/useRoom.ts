import { useConfirmDialog, useFormErrors } from "@/hooks";
import { createOrUpdateRoomSchema } from "@/lib/validation";
import {
  ApiResponse,
  RoomFormValue,
  RoomResponse,
  IRoomStatisticsResponse,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect, useCallback, ChangeEvent } from "react";
import { toast } from "sonner";
import { Status, Notice } from "@/enums";
import { useSearchParams } from "react-router-dom";
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

  const idRef = useRef<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [value, setValue] = useState<RoomFormValue>({
    // floorId: "",
    acreage: null,
    price: null,
    maximumPeople: null,
    roomType: null,
    roomstatus: null,
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
    if (filterValues.query || filterValues.status || filterValues.roomType) {
      setSearchParams(params);
    }
  }, [filterValues, setSearchParams]);

  const {
    data: roomData,
    isLoading,
    isError: isRoomError,
  } = useQuery<ApiResponse<RoomResponse[]>>({
    queryKey: ["rooms", page, size, status, roomType, query],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: parsedPage.toString(),
        size: parsedSize.toString(),
      };
      if (status) params.status = status;
      if (roomType) params.roomType = roomType;
      if (query) params.query = query;

      const res = await httpRequest.get("/rooms", { params });
      return res.data;
    },
  });
  console.log("roomData", roomData?.data);
  useEffect(() => {
    if (isRoomError) {
      toast.error("Không thể tải dữ liệu phòng. Vui lòng thử lại sau.");
    }
  }, [isRoomError]);

  const { data: statisticsRaw } = useQuery<ApiResponse<IRoomStatisticsResponse>>({
    queryKey: ["room-statistics"],
    queryFn: async () => (await httpRequest.get("/rooms/statistics", {
      params: {
        floorId: "080c75d6-2893-4eb8-aa24-aa200c8021e7"
      }
    })).data,
  });
  
  useEffect(() => {
  console.log("Statistics Raw:", statisticsRaw);
}, [statisticsRaw]);

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

  const resetForm = () => {
    setValue({
      // floorId: "",
      acreage: null,
      price: null,
      maximumPeople: null,
      roomType: null,
      roomstatus: null,
      description: "",
    });
    idRef.current = "";
    clearErrors();
  };

  const handleSaveRoom = async () => {
    try {
      console.log("Payload gửi lên:", value);
      await createOrUpdateRoomSchema.parseAsync(value);
      if (idRef.current) {
        await updateRoomMutation.mutateAsync(value);
      } else {
        await createRoomMutation.mutateAsync(value);
      }
      resetForm();
      setIsModalOpen(false);
      return true;
    } catch (error) {
      console.error("Lỗi khi lưu phòng:", error);
      handleZodErrors(error);
      return false;
    }
  };

  const handleActionClick = (room: RoomResponse, type: "update" | "delete") => {
    if (type === "update") {
      idRef.current = room.id;
      setValue({
        // floorId: "", // cần map nếu có floor trong RoomResponse
        acreage: room.acreage,
        price: room.price,
        maximumPeople: room.maximumPeople,
        roomType: room.roomType,
        roomstatus: room.roomstatus,
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
  };
};
