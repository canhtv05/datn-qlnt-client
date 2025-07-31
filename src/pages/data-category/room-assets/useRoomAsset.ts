import { StatisticCardType } from "@/components/StatisticCard";
import { AssetStatus, Notice, RoomStatus, RoomType, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { createOrUpdateAssetSchema } from "@/lib/validation";
import {
  ApiResponse,
  AssetFilter,
  AssetResponse,
  CreateAssetInit2Response,
  IAssetStatisticsResponse,
  IUpdateAsset,
  IUpdateRoomAsset,
  PaginatedResponse,
  RoomAssetFilter,
  RoomAssetResponse,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { is } from "date-fns/locale";
import { CircleCheck, CircleDollarSign, XCircle } from "lucide-react";
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
      building = "",
      floor = "",
      roomType = "",
      status = "",
    } = queryFilter(
      searchParams,
      "page",
      "size",
      "building",
      "floor",
      "roomType",
      "status"
    );
    
  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<IUpdateRoomAsset>({
   assetName: "",
  price: 0,
  assetStatus: "",
  description: ""
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const { clearErrors, errors, handleZodErrors } = useFormErrors<IUpdateAsset>();

  const [filterValues, setFilterValues] = useState<RoomAssetFilter>({
    building: "",
    floor: "",
    roomType: RoomType.DON,
    status: RoomStatus.TRONG || "",
  });

  const handleClear = () => {
    setFilterValues({
      building: "",
      floor: "",
      roomType: RoomType.DON,
      status: RoomStatus.TRONG || "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.building) params.set("building", filterValues.building);
    if (filterValues.floor) params.set("floor", filterValues.floor);
    if (filterValues.roomType) params.set("roomType", filterValues.roomType);
    if (filterValues.status) params.set("status", filterValues.status);
    params.set("page", "1");
    if (filterValues.building || filterValues.floor || filterValues.roomType || filterValues.status) {
      setSearchParams(params);
    }
  }, [filterValues.building, filterValues.floor, filterValues.roomType, filterValues.status, setSearchParams]);

  const { data, isLoading, isError } = useQuery<ApiResponse<PaginatedResponse<RoomAssetResponse[]>>>({
    queryKey: ["asset-rooms", page, size, building, floor, status, roomType],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (building) params["building"] = building;
      if (floor) params["floor"] = floor;
      if (roomType) params["roomType"] = roomType;
      if (status) params["status"] = status;

      const res = await httpRequest.get(`/asset-rooms/${roomId}`
        , {
        params,
      }
    );

      return res.data.data;
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

  const { data: statistics, isError: isStatisticsError } = useQuery<ApiResponse<IAssetStatisticsResponse>>({
      queryKey: ["asset-statistics"],
      queryFn: async () => {
        const res = await httpRequest.get("/assets/statistics");
        return res.data;
      },
      retry: 1,
    });


  const dataAssets: StatisticCardType[] = [
    {
      icon: CircleDollarSign,
      label: "Tài sản",
      value: statistics?.data.totalAssets ?? 0,
    },
    {
      icon: CircleCheck,
      label: "Hoạt động",
      value: statistics?.data.totalActiveAssets ?? 0,
    },
    {
      icon: XCircle,
      label: "Không hoạt động",
      value: statistics?.data.totalDisabledAssets ?? 0,
    },
  ];

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

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" | "toggle" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "delete") return await handleRemoveRoomAssetById(id);
      if (type === "toggle") return await handleToggleStatusRoomAssetById(id);
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
  }

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

  // const handleUpdateFloor = useCallback(async () => {
  //   try {
  //     const {
  //       assetBeLongTo,
  //       assetType,
  //       buildingID,
  //       descriptionAsset,
  //       floorID,
  //       nameAsset,
  //       price,
  //       roomID,
  //       tenantId,
  //       assetStatus,
  //     } = value;

  //     const data: IUpdateAsset = {
  //       assetBeLongTo,
  //       assetType: assetType ?? "",
  //       buildingID: buildingID ?? "",
  //       descriptionAsset: descriptionAsset.trim(),
  //       floorID: floorID ?? "",
  //       nameAsset: nameAsset.trim(),
  //       price,
  //       roomID: roomID ?? "",
  //       tenantId: tenantId ?? "",
  //       assetStatus,
  //     };

  //     await createOrUpdateAssetSchema.parseAsync(data);

  //     updateRoomAssetMutation.mutate(data, {
  //       onSuccess: () => {
  //         setValue({
  //           assetBeLongTo: "",
  //           assetType: "",
  //           buildingID: "",
  //           descriptionAsset: "",
  //           floorID: "",
  //           nameAsset: "",
  //           price: undefined,
  //           roomID: "",
  //           tenantId: "",
  //           assetStatus: "",
  //         });
  //         queryClient.invalidateQueries({
  //           predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "assets",
  //         });
  //         toast.success(Status.UPDATE_SUCCESS);
  //         setIsModalOpen(false);
  //       },
  //     });
  //     clearErrors();
  //     return true;
  //   } catch (error) {
  //     handleZodErrors(error);
  //     return false;
  //   }
  // }, [updateRoomAssetMutation, clearErrors, handleZodErrors, queryClient, value]);

  const handleSaveRoomAsset = useCallback(async () => {
    try {
      await updateRoomAssetMutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "asset-rooms",
          });
          toast.success(Status.UPDATE_SUCCESS);
        },
      });
    
      setIsModalOpen(false);
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [value ,updateRoomAssetMutation, handleZodErrors]);

  const handleActionClick = useCallback(
    (assetRooms: AssetResponse, action: "update" | "toggle" | "delete") => {
      idRef.current = assetRooms.id;
      if (action === "update") {
        console.log("Updating asset:", assetRooms);
        setValue({
          assetName: assetRooms.assetName,
          price: assetRooms.price,
          assetStatus: assetRooms.assetStatus,
          description: assetRooms.description,
        });
        setIsModalOpen(true);
      } else if(action === "delete") {
        openDialog(
          { id: assetRooms.id, type: action },
          {
            type: "warn",
            desc: Notice.REMOVE,
          }
        );
      } else if(action === "toggle") {
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

  const { data: assetsInfo, isError: isErrorAssetInfo } = useQuery<ApiResponse<CreateAssetInit2Response>>({
    queryKey: ["assets-init"],
    queryFn: async () => {
      const res = await httpRequest.get("/assets/init/2");
      return res.data;
    },
    retry: 1,
  });

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

    if (isErrorAssetInfo) {
      toast.error("Không lấy được dữ liệu tài sản");
    }
  }, [isError, isErrorAssetInfo]);

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      // nameAsset,
    },
    setSearchParams,
    props,
    data,
    dataAssets,
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
    assetsInfo,
  };
};
