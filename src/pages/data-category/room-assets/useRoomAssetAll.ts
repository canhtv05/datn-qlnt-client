import { useConfirmDialog } from "@/hooks";
import {
  ApiResponse,
  RoomAssetAllFormValue,
  RoomResponse,
  RoomAssetAllResponse,
  RoomAssetStatisticsResponse,
  AssetRoomFilter,
} from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Notice } from "@/enums";
import { useParams, useSearchParams } from "react-router-dom";
import { Building2, HandCoins, DoorOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

const mapStatistics = (data?: RoomAssetStatisticsResponse) => ({
  total: data?.totalAssets ?? 0,
  totalActive: data?.totalActiveAssets ?? 0,
  disabled: data?.totalDisabledAssets ?? 0,
});

export const useRoomAssetAll = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const { id: buildingId } = useParams();

  const { page = "1", size = "15" } = queryFilter(searchParams, "page", "size");

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<AssetRoomFilter>({
    building: "",
    floor: "",
    roomType: "",
    status: "",
    query: "",
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

  const handleClear = () => {
    setFilterValues({
      building: "",
      floor: "",
      roomType: "",
      status: "",
      query: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.roomType) params.set("roomType", filterValues.roomType);
    if (filterValues.status) params.set("status", filterValues.status);
    if (filterValues.query) params.set("query", filterValues.query);
    params.set("page", "1");
    if (filterValues.query || filterValues.roomType || filterValues.status) {
      setSearchParams(params);
    }
  }, [filterValues.query, filterValues.roomType, filterValues.status, setSearchParams]);

  const {
    data: roomAssetAllData,
    isLoading,
    isError: isRoomAssetAllError,
  } = useQuery<ApiResponse<RoomAssetAllResponse[]>>({
    queryKey: ["room-asset-all", page, size, ...Object.values(filterValues)],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: parsedPage.toString(),
        size: parsedSize.toString(),
      };
      Object.entries(filterValues).forEach(([k, v]) => {
        if (v) params[k] = v;
        if (buildingId) params.building = buildingId;
      });
      const res = await httpRequest.get("/asset-rooms", { params });
      return res.data;
    },
  });

  useEffect(() => {
    if (isRoomAssetAllError) toast.error(t("roomAsset.errorFetch"));
  }, [isRoomAssetAllError, t]);

  const { data: roomListData, isLoading: isLoadingRoomList } = useQuery<
    ApiResponse<RoomResponse[]>
  >({
    queryKey: ["room-list"],
    queryFn: async () => (await httpRequest.get("/rooms/all")).data,
    retry: 1,
  });

  const { data: statisticsRaw } = useQuery<ApiResponse<RoomAssetStatisticsResponse>>({
    queryKey: ["room-statistics", filterValues.building],
    queryFn: async () => (await httpRequest.get(`/asset-rooms/statistics/${buildingId}`)).data,
    // enabled: !!filterValues.building,
    retry: 1,
  });

  const roomStats = [
    {
      icon: DoorOpen,
      label: t("roomAsset.stats.total"),
      value: mapStatistics(statisticsRaw?.data).total,
    },
    {
      icon: HandCoins,
      label: t("roomAsset.stats.active"),
      value: mapStatistics(statisticsRaw?.data).totalActive,
    },
    {
      icon: Building2,
      label: t("roomAsset.stats.inactive"),
      value: mapStatistics(statisticsRaw?.data).disabled,
    },
  ];

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string }>({
    onConfirm: async () => {
      try {
        return true;
      } catch {
        return false;
      }
    },
  });

  const handleActionClick = (
    roomAsset: RoomAssetAllResponse,
    type: "update" | "delete" | "view"
  ) => {
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
    } else if (type === "delete") {
      openDialog({ id: roomAsset.id }, { type: "warn", desc: t(Notice.REMOVE) });
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
    isModalOpen,
    setIsModalOpen,
    handleActionClick,
    ConfirmDialog,
    rowSelection,
    setRowSelection,
    roomList: roomListData?.data ?? [],
    isLoadingRoomList,
  };
};
