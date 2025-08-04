import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import {
  ApiResponse,
  AssetResponse,
  AssetRoomDetailResponse,
  AssetRoomFilter,
  IUpdateAsset,
  IUpdateRoomAsset,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

interface AssetProps {
  roomId: string;
}

export const useRoomAsset = ({ roomId }: AssetProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    query = "",
    roomType = "",
    status = "",
  } = queryFilter(searchParams, "page", "size", "query", "roomType", "status");
  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<IUpdateRoomAsset>({
    assetName: "",
    price: 0,
    assetStatus: "",
    description: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const { clearErrors, errors, handleZodErrors } = useFormErrors<IUpdateAsset>();

  const [filterValues, setFilterValues] = useState<AssetRoomFilter>({
    building: "",
    floor: "",
    roomType: "",
    status: "",
    query: "",
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

  const { data, isLoading, isError } = useQuery<ApiResponse<AssetRoomDetailResponse>>({
    queryKey: ["asset-rooms", page, size, query, status, roomType],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (roomType) params["roomType"] = roomType;
      if (status) params["status"] = status;
      if (query) params["query"] = query;

      const res = await httpRequest.get(`/asset-rooms/${roomId}`, {
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

  // const { data: statistics, isError: isStatisticsError } = useQuery<ApiResponse<IAssetStatisticsResponse>>({
  //   queryKey: ["asset-statistics"],
  //   queryFn: async () => {
  //     const res = await httpRequest.get("/assets/statistics", { params: buildingId });
  //     return res.data;
  //   },
  //   retry: 1,
  //   enabled: !!buildingId,
  // });

  // const dataAssets: StatisticCardType[] = [
  //   {
  //     icon: CircleDollarSign,
  //     label: "Tài sản",
  //     value: statistics?.data.totalAssets ?? 0,
  //   },
  //   {
  //     icon: CircleCheck,
  //     label: "Hoạt động",
  //     value: statistics?.data.totalActiveAssets ?? 0,
  //   },
  //   {
  //     icon: XCircle,
  //     label: "Không hoạt động",
  //     value: statistics?.data.totalDisabledAssets ?? 0,
  //   },
  // ];

  const updateRoomAssetMutation = useMutation({
    mutationKey: ["update-room-assets"],
    mutationFn: async (payload: IUpdateRoomAsset) => await httpRequest.put(`/asset-rooms/${idRef.current}`, payload),
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const removeRoomAssetMutation = useMutation({
    mutationKey: ["remove-room-assets"],
    mutationFn: async (id: string) => await httpRequest.delete(`/asset-rooms/${id}`),
  });

  const toggleStatusRoomAssetMutation = useMutation({
    mutationKey: ["toggle-room-assets"],
    mutationFn: async (id: string) => await httpRequest.put(`/asset-rooms/toggle/${id}`),
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" | "status" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "delete") return await handleRemoveRoomAssetById(id);
      if (type === "status") return await handleToggleStatusRoomAssetById(id);
      return false;
    },
  });

  const handleToggleStatusRoomAssetById = async (id: string): Promise<boolean> => {
    try {
      await toggleStatusRoomAssetMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "asset-rooms",
          });
          toast.success(Status.UPDATE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleRemoveRoomAssetById = async (id: string): Promise<boolean> => {
    try {
      await removeRoomAssetMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "asset-rooms",
          });
          toast.success(Status.REMOVE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleSaveRoomAsset = useCallback(async () => {
    try {
      await updateRoomAssetMutation.mutateAsync(value as IUpdateRoomAsset, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "asset-rooms",
          });
          toast.success(Status.UPDATE_SUCCESS);
        },
      });

      setIsModalOpen(false);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [updateRoomAssetMutation, value, clearErrors, queryClient, handleZodErrors]);

  const handleActionClick = useCallback(
    (assetRooms: AssetResponse, action: "update" | "status" | "delete") => {
      idRef.current = assetRooms.id;
      if (action === "update") {
        const data = {
          assetName: assetRooms.nameAsset,
          price: assetRooms.price,
          assetStatus: assetRooms.assetStatus,
          description: assetRooms.descriptionAsset,
        };
        setValue(data);
        setIsModalOpen(true);
      } else if (action === "delete") {
        openDialog(
          { id: assetRooms.id, type: action },
          {
            type: "warn",
            desc: Notice.REMOVE,
          }
        );
      } else if (action === "status") {
        openDialog(
          { id: assetRooms.id, type: action },
          {
            type: "default",
            desc: Notice.TOGGLE_STATUS,
          }
        );
      }
    },
    [openDialog]
  );

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
  };

  useEffect(() => {
    if (isError) {
      toast.error("Có lỗi xảy ra khi tải loại tài sản");
    }

    // if (isStatisticsError) {
    //   toast.error("Có lỗi xảy ra khi tải thống kê");
    // }
  }, [isError]);

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      // nameAsset,
    },
    setSearchParams,
    props,
    data,
    // dataAssets,
    isLoading,
    handleActionClick,
    rowSelection,
    setRowSelection,
    handleSaveRoomAsset,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    // handleUpdateFloor,
    value,
    setValue,
    errors,
    ConfirmDialog,
  };
};
