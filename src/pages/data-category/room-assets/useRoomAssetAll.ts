import { useConfirmDialog, useFormErrors } from "@/hooks";
import { createOrUpdateRoomSchema } from "@/lib/validation";
import {
  ApiResponse,
  RoomAssetAllFormValue,
  RoomResponse,
  IRoomStatisticsResponse,
  FloorBasicResponse,
  FilterRoomValues,
  RoomAssetAllResponse,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect, useCallback, ChangeEvent } from "react";
import { toast } from "sonner";
import { Status, Notice, AssetBeLongTo } from "@/enums";
import { useParams, useSearchParams } from "react-router-dom";
import { Building2, HandCoins, DoorOpen } from "lucide-react";
import { useRoomAssetDrawerStore } from "@/zustand/openModalStore";

const mapStatistics = (data?: IRoomStatisticsResponse) => ({
  renting: data?.getTotalDangThue ?? 0,
  depositing: data?.getTotalDaDatCoc ?? 0,
  empty: data?.getTotalTrong ?? 0,
});

export const useRoomAssetAll = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id: buildingIdParam } = useParams();

  const {
    page = "1",
    size = "15",
    status = "",
    maxPrice = "",
    minPrice = "",
    maxAcreage = "",
    minAcreage = "",
    maximumPeople = "",
    nameFloor = "",
    buildingId = "",
    floorId = "",
  } = queryFilter(
    searchParams,
    "page",
    "size",
    "status",
    "maxPrice",
    "minPrice",
    "maxAcreage",
    "minAcreage",
    "maximumPeople",
    "nameFloor",
    "buildingId",
    "floorId"
  );

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<FilterRoomValues>({
    status,
    maxPrice,
    minPrice,
    maxAcreage,
    minAcreage,
    maximumPeople,
    nameFloor,
    buildingId: buildingId || buildingIdParam || "",
    floorId,
  });

  const idRef = useRef<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rowSelection, setRowSelection] = useState({});
  const [value, setValue] = useState<RoomAssetAllFormValue>({
    id: "",
  roomCode: "",
  totalAssets: 0,
  roomType: "",
  status: "",
  description: "",
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<RoomAssetAllFormValue>();

  useEffect(() => {
    setFilterValues({
      status,
      maxPrice,
      minPrice,
      maxAcreage,
      minAcreage,
      maximumPeople,
      nameFloor,
      buildingId: buildingId || buildingIdParam || "",
      floorId,
    });
  }, [status, maxPrice, minPrice, maxAcreage, minAcreage, maximumPeople, nameFloor, buildingId, buildingIdParam, floorId]);

  const handleClear = () => {
    setFilterValues({
      status: "",
      maxPrice: "",
      minPrice: "",
      maxAcreage: "",
      minAcreage: "",
      maximumPeople: "",
      nameFloor: "",
      buildingId: "",
      floorId: "",
    });
    setSearchParams({});
  };



  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filterValues).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    params.set("page", "1");
    setSearchParams(params);
  }, [filterValues, setSearchParams]);

  const {
    data: roomAssetAllData,
    isLoading,
    isError: isRoomAssetAllError,
  } = useQuery<ApiResponse<RoomAssetAllResponse[]>>({
    queryKey: ["room-asset-all", page, size, ...Object.values(filterValues)],
    queryFn: async () => {
      const params: Record<string, string> = { page: parsedPage.toString(), size: parsedSize.toString() };
      Object.entries(filterValues).forEach(([k, v]) => {
        if (v) params[k] = v;
      });
      const res = await httpRequest.get("/asset-rooms", { params });
      return res.data;
    },
  });

  useEffect(() => {
    if (isRoomAssetAllError) toast.error("Không thể tải dữ liệu tài sản phòng. Vui lòng thử lại sau.");
  }, [isRoomAssetAllError]);

  const { data: roomListData, isLoading: isLoadingRoomList } = useQuery<ApiResponse<RoomResponse[]>>({
    queryKey: ["room-list"],
    queryFn: async () =>
      (await httpRequest.get("/rooms/all")).data,
    retry: 1,
  });

  const { data: statisticsRaw } = useQuery<ApiResponse<IRoomStatisticsResponse>>({
    queryKey: ["room-statistics", filterValues.buildingId],
    queryFn: async () =>
      (await httpRequest.get("/rooms/statistics", { params: { buildingId: filterValues.buildingId } })).data,
    enabled: !!filterValues.buildingId,
    retry: 1,
  });

  const roomStats = [
    { icon: DoorOpen, label: "Đang trống", value: mapStatistics(statisticsRaw?.data).empty },
    { icon: HandCoins, label: "Đang đặt cọc", value: mapStatistics(statisticsRaw?.data).depositing },
    { icon: Building2, label: "Đang thuê", value: mapStatistics(statisticsRaw?.data).renting },
  ];

  const createRoomMutation = useMutation({
    mutationKey: ["create-room"],
    mutationFn: (payload: RoomAssetAllFormValue) => httpRequest.post("/rooms", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-statistics"] });
      toast.success(Status.ADD_SUCCESS);
    },
    onError: handleMutationError,
  });

  const updateRoomMutation = useMutation({
    mutationKey: ["update-room"],
    mutationFn: (payload: RoomAssetAllFormValue) => httpRequest.put(`/rooms/update/${idRef.current}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-statistics"] });
      toast.success(Status.UPDATE_SUCCESS);
    },
    onError: handleMutationError,
  });

  const deleteRoomMutation = useMutation({
    mutationKey: ["delete-room"],
    mutationFn: (id: string) => httpRequest.delete(`/rooms/delete/${id}`),
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
      id: "",
  roomCode: "",
  totalAssets: 0,
  roomType: "",
  status: "",
  description: "",
    });
    idRef.current = "";
    clearErrors();
  }, [clearErrors]);

  const handleSaveRoom = useCallback(async () => {
    try {
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
      handleZodErrors(error);
      return false;
    }
  }, [value, resetForm, updateRoomMutation, createRoomMutation, handleZodErrors]);

  const handleActionClick = (roomAsset: RoomAssetAllResponse, type: "update" | "delete" | "view") => {
    if (type === "update") {
      idRef.current = roomAsset.id;
      setValue({
        id: roomAsset.id ?? "",
        roomCode: roomAsset.roomCode ?? "",
        totalAssets: roomAsset.totalAssets ?? 0,
        roomType: roomAsset.roomType ?? "",
        status: roomAsset.status ?? "",
        description: roomAsset.description ?? "",
      });
      setIsModalOpen(true);
    } else if (type === 'view'){
      console.log("View room details:", roomAsset);
      const openDrawer = useRoomAssetDrawerStore.getState().openDrawer
      openDrawer(roomAsset);
    } else {
      openDialog({ id: roomAsset.id }, { type: "warn", desc: Notice.REMOVE });
    }
  };

  return {
    query: { page: parsedPage, size: parsedSize, ...filterValues },
    setSearchParams,
    props: { filterValues, setFilterValues, onClear: handleClear, onFilter: handleFilter },
    data: roomAssetAllData,
    isLoading,
    statistics: roomStats,
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
    roomList: roomListData?.data ?? [],
    isLoadingRoomList,
  };
};
