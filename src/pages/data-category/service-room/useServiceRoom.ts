import { StatisticCardType } from "@/components/StatisticCard";
import {
  ApiResponse,
  CreateRoomServiceInitResponse,
  IBuildingCardsResponse,
  IdAndName,
  ServiceRoomFilter,
  ServiceRoomStatistics,
  ServiceRoomView,
} from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useQuery } from "@tanstack/react-query";
import { CircleCheck, Puzzle, XCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useServiceRoom = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    query = "",
    floor = "",
    roomType = "",
    status = "",
  } = queryFilter(searchParams, "page", "size", "query", "building", "floor", "floor", "status");

  const { id } = useParams();
  const [rowSelection, setRowSelection] = useState({});

  const [isModalOpen, setIsModalOpen] = useState(false);

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<ServiceRoomFilter>({
    building: "",
    floor,
    query,
    roomType,
    status,
  });

  const handleClear = () => {
    setFilterValues({
      building: "",
      floor: "",
      query: "",
      roomType: "",
      status: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.query) params.set("query", filterValues.query);
    if (filterValues.status) params.set("status", filterValues.status);
    if (filterValues.building) params.set("building", filterValues.building);
    if (filterValues.floor) params.set("floor", filterValues.floor);
    if (filterValues.roomType) params.set("roomType", filterValues.roomType);
    params.set("page", "1");
    if (
      filterValues.roomType ||
      filterValues.floor ||
      filterValues.building ||
      filterValues.query ||
      filterValues.status
    ) {
      setSearchParams(params);
    }
  }, [
    filterValues.floor,
    filterValues.roomType,
    filterValues.building,
    filterValues.query,
    filterValues.status,
    setSearchParams,
  ]);

  const { data, isLoading, isError } = useQuery<ApiResponse<ServiceRoomView[]>>({
    queryKey: ["service-rooms", page, size, query, status, id, floor, roomType],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (id) params["building"] = id;
      if (floor) params["floor"] = floor;
      if (query) params["query"] = query;
      if (roomType) params["roomType"] = roomType;
      if (status) params["status"] = status;

      const res = await httpRequest.get("/service-rooms", { params });

      return res.data;
    },
    retry: 1,
  });

  const { data: serviceRoomInit, isError: isErrorServiceRoom } = useQuery<ApiResponse<CreateRoomServiceInitResponse>>({
    queryKey: ["room-services-init", id],
    queryFn: async () => {
      const res = await httpRequest.get("/service-rooms/init", { params: { buildingId: id } });
      return res.data;
    },
    retry: 1,
    enabled: !!id,
  });

  const { data: statistics, isError: isStatisticsError } = useQuery<ApiResponse<ServiceRoomStatistics>>({
    queryKey: ["service-rooms-statistics"],
    queryFn: async () => {
      const res = await httpRequest.get(`/service-rooms/statistics/${id}`);
      return res.data;
    },
    retry: 1,
    enabled: !!id,
  });

  const { data: buildingData, isError: isBuildingError } = useQuery<ApiResponse<IBuildingCardsResponse[]>>({
    queryKey: ["buildings-cards"],
    queryFn: async () => {
      const res = await httpRequest.get("/buildings/cards");
      return res.data;
    },
  });

  const { data: floorsData, isError: isFloorsError } = useQuery<ApiResponse<IdAndName[]>>({
    queryKey: ["floors-all"],
    queryFn: async () => {
      const res = await httpRequest.get("/floors/all");
      return res.data;
    },
  });

  const roomOptions = useMemo(() => {
    return (
      serviceRoomInit?.data?.rooms?.map((room) => ({
        label: room.name,
        value: room.id,
      })) ?? []
    );
  }, [serviceRoomInit]);

  const serviceOptions = useMemo(() => {
    return (
      serviceRoomInit?.data?.services?.map((room) => ({
        label: room.name,
        value: room.id,
      })) ?? []
    );
  }, [serviceRoomInit]);

  const buildingOptions = useMemo(() => {
    return (
      buildingData?.data?.map((b) => ({
        label: b.buildingName,
        value: b.id,
      })) ?? []
    );
  }, [buildingData]);

  const floorOptions = useMemo(() => {
    return (
      floorsData?.data?.map((f) => ({
        label: f.name,
        value: f.id,
      })) ?? []
    );
  }, [floorsData]);

  const dataServices: StatisticCardType[] = [
    {
      icon: Puzzle,
      label: "Tổng",
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
    buildingOptions,
    floorOptions,
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

    if (isBuildingError) {
      toast.error("Không lấy được dữ liệu tòa nhà");
    }

    if (isFloorsError) {
      toast.error("Không lấy được dữ liệu tầng");
    }
  }, [isBuildingError, isError, isErrorServiceRoom, isFloorsError, isStatisticsError]);

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      query,
      id,
      floor,
      roomType,
      status,
    },
    setSearchParams,
    serviceRoomInit,
    dataServices,
    props,
    data,
    isLoading,
    rowSelection,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    roomOptions,
    serviceOptions,
    buildingOptions,
  };
};
