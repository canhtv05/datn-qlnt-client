import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import Modal from "@/components/Modal";
import AddOrUpdateRoomAsset from "./AddOrUpdateRoomAsset";
import { useFormErrors } from "@/hooks/useFormErrors";
import { useConfirmDialog } from "@/hooks";
import { ACTION_BUTTONS } from "@/constant";
import RenderIf from "@/components/RenderIf";
import {
  IBtnType,
  ApiResponse,
  RoomAssetFormValue,
  RoomResponse,
  AssetResponse,
  ICreateAndUpdateBulkRoomAsset,
  RoomAssetBulkFormValue,
  AllRoomAssetFormValue,
  RoomAssetAllResponse,
} from "@/types";
import { Notice, Status } from "@/enums";
import { httpRequest } from "@/utils/httpRequest";
import { addToAllRoomAssetSchema, roomAssetBulkSchema, roomAssetFormSchema } from "@/lib/validation";
import { handleMutationError } from "@/utils/handleMutationError";
import { Building, Layers } from "lucide-react";
import { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import { useParams, useSearchParams } from "react-router-dom";
import { handleExportExcel, roomStatusEnumToString, roomTypeEnumToString } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const RoomAssetButton = ({
  ids,
  roomId,
  type = "detail",
  buildingOptions,
  data,
}: {
  data?: RoomAssetAllResponse[];
  ids: Record<string, boolean>;
  roomId: string;
  type: "default" | "detail" | "asset";
  buildingOptions: FieldsSelectLabelType[] | undefined;
}) => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState<RoomAssetFormValue>({
    assetBeLongTo: "PHONG",
    roomId: "",
    assetId: "",
    assetName: "",
    price: 0,
    description: "",
    buildingId: "",
    quantity: 1,
  });

  const [bulkValue, setBulkValue] = useState<RoomAssetBulkFormValue>({
    assetId: "",
    roomId: "",
  });

  const [allRoomValue, setAllRoomValue] = useState<AllRoomAssetFormValue>({
    assetId: "",
    buildingId: "",
  });

  let LOCAL_ACTION_BUTTONS: IBtnType[] = [];

  if (type === "default") {
    LOCAL_ACTION_BUTTONS.push({
      tooltipContent: "actions.serviceActions.addMore",
      icon: Layers,
      arrowColor: "var(--color-emerald-500)",
      type: "bulkAdd",
      hasConfirm: false,
    });
  }

  LOCAL_ACTION_BUTTONS.push(...ACTION_BUTTONS);
  if (type === "default") {
    LOCAL_ACTION_BUTTONS = LOCAL_ACTION_BUTTONS.filter((b) => b.type !== "default" && b.type !== "delete");
  }

  if (type === "asset") {
    LOCAL_ACTION_BUTTONS = [
      {
        tooltipContent: "actions.serviceActions.addToBuilding",
        icon: Building,
        arrowColor: "var(--color-green-600)",
        type: "addToAllRoom",
        hasConfirm: false,
      },
    ];
  }

  // const { id: buildingId } = useParams();
  const { errors, clearErrors, handleZodErrors } = useFormErrors<RoomAssetFormValue>();
  const queryClient = useQueryClient();

  const { data: roomListData } = useQuery<ApiResponse<RoomResponse[]>>({
    queryKey: ["room-list", id || searchParams.get("buildingId")],
    queryFn: async () => {
      const res = await httpRequest.get("/rooms/find-all", {
        params: { buildingId: id || searchParams.get("buildingId") },
      });
      return res.data;
    },
  });

  const { data: assetsListData } = useQuery<ApiResponse<AssetResponse[]>>({
    queryKey: ["assets-find-all"],
    queryFn: async () => {
      const res = await httpRequest.get("/assets/find-all", {
        params: { buildingId: id || searchParams.get("buildingId") },
      });
      return res.data;
    },
  });

  const handleChange = useCallback(
    <K extends keyof ICreateAndUpdateBulkRoomAsset>(field: K, newValue: ICreateAndUpdateBulkRoomAsset[K]) => {
      setValue((prev) => ({ ...prev, [field]: newValue }));
    },
    []
  );

  const addRoomAssetMutation = useMutation({
    mutationKey: ["add-room-asset"],
    mutationFn: async (payload: RoomAssetFormValue) => await httpRequest.post("/asset-rooms", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValue({
        assetBeLongTo: "PHONG",
        roomId: "",
        assetId: "",
        assetName: "",
        price: 0,
        description: "",
        quantity: 1,
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "asset-rooms",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "room-asset-all",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "room-statistics",
      });
      queryClient.invalidateQueries({ queryKey: ["assets-find-all"] });
    },
  });

  const bulkAddRoomAssetMutation = useMutation({
    mutationKey: ["bulk-add-room-asset"],
    mutationFn: async (payload: RoomAssetBulkFormValue) => {
      const { roomId, assetId } = payload;

      const roomIds = Array.isArray(roomId) ? roomId : [roomId];
      const assetIds = Array.isArray(assetId) ? assetId : [assetId];

      let endpoint = "/asset-rooms";

      if (roomIds.length > 1) {
        endpoint = "/asset-rooms/by-asset";
      } else if (assetIds.length > 1) {
        endpoint = "/asset-rooms/by-room";
      }

      return await httpRequest.post(endpoint, payload);
    },
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setBulkValue({
        roomId: "",
        assetId: "",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "asset-rooms",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "room-asset-all",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "room-statistics",
      });
      queryClient.invalidateQueries({ queryKey: ["assets-find-all"] });
    },
  });

  const handleBulkAddRoomAsset = useCallback(async () => {
    try {
      const fullValue = {
        ...bulkValue,
        ...(Array.isArray(bulkValue.roomId) && bulkValue.roomId.length === 1
          ? { roomId: bulkValue.roomId[0] }
          : Array.isArray(bulkValue.roomId) && bulkValue.roomId.length > 1
          ? { roomIds: bulkValue.roomId }
          : {}),
        ...(Array.isArray(bulkValue.assetId) && bulkValue.assetId.length === 1
          ? { assetId: bulkValue.assetId[0] }
          : Array.isArray(bulkValue.assetId) && bulkValue.assetId.length > 1
          ? { assetIds: bulkValue.assetId }
          : {}),
      };

      await roomAssetBulkSchema.parseAsync(fullValue);
      await bulkAddRoomAssetMutation.mutateAsync(fullValue);
      clearErrors();
      return true;
    } catch (error) {
      // console.log("Error adding room asset:", error);
      handleZodErrors(error);
      return false;
    }
  }, [bulkValue, bulkAddRoomAssetMutation, clearErrors, handleZodErrors]);

  const addToAllRoomAssetMutation = useMutation({
    mutationKey: ["add-all-room-asset"],
    mutationFn: async (payload: AllRoomAssetFormValue) => await httpRequest.post("/asset-rooms/by-building", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setAllRoomValue({
        assetId: "",
        buildingId: "",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "asset-rooms",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "room-asset-all",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "room-statistics",
      });
      queryClient.invalidateQueries({ queryKey: ["assets-find-all"] });
    },
  });

  const handleAddToAllRoom = useCallback(async () => {
    try {
      const fullValue: AllRoomAssetFormValue = {
        ...allRoomValue,
        buildingId: id || "",
      };

      await addToAllRoomAssetSchema.parseAsync(fullValue);
      await addToAllRoomAssetMutation.mutateAsync(fullValue);
      clearErrors();
      return true;
    } catch (error) {
      // console.log("Error adding room asset:", error);
      handleZodErrors(error);
      return false;
    }
  }, [allRoomValue, id, addToAllRoomAssetMutation, clearErrors, handleZodErrors]);
  const handleAddRoomAsset = useCallback(async () => {
    try {
      const fullValue = {
        ...value,
        roomId: roomId ?? "",
      };

      await roomAssetFormSchema.parseAsync(fullValue);
      await addRoomAssetMutation.mutateAsync(fullValue);
      clearErrors();
      return true;
    } catch (error) {
      // console.log("Error adding room asset:", error);
      handleZodErrors(error);
      return false;
    }
  }, [value, addRoomAssetMutation, clearErrors, handleZodErrors, roomId]);

  const removeRoomAssetMutation = useMutation({
    mutationKey: ["remove-room-asset"],
    mutationFn: async (id: string) => await httpRequest.delete(`/asset-rooms/${id}`),
  });

  const handleRemoveRoomAsset = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        .filter(([, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeRoomAssetMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "asset-rooms",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "room-asset-all",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "room-statistics",
      });
      queryClient.invalidateQueries({ queryKey: ["assets-find-all"] });
      toast.success(Status.REMOVE_SUCCESS);

      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const { ConfirmDialog, openDialog } = useConfirmDialog<Record<string, boolean>>({
    onConfirm: async (ids?: Record<string, boolean>) => {
      if (!ids || !Object.values(ids).some(Boolean)) return false;
      return await handleRemoveRoomAsset(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các tài sản phòng đã chọn. Bạn có chắc chắn muốn tiếp tục?",
    type: "warn",
  });

  const handleButton = useCallback(
    (btn: IBtnType) => {
      if (btn.type === "delete") {
        openDialog(ids);
      } else if (btn.type === "download") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const exportData: Record<string, any>[] | undefined = data?.map((d) => ({
          "Mã phòng": d.roomCode,
          "Số tài sản": d.totalAssets || 0,
          "Loại phòng": roomTypeEnumToString(d.roomType),
          "Trạng thái": roomStatusEnumToString(d.status),
          "Mô tả": d.description,
        }));
        handleExportExcel(`Tài sản phòng`, exportData, data);
      }
    },
    [data, ids, openDialog]
  );

  return (
    <div className="h-full bg-background rounded-t-sm">
      <div className={type !== "asset" ? "flex px-4 py-3 justify-between items-center" : ""}>
        {type !== "asset" && <h3 className="font-semibold">Tài sản phòng</h3>}
        <div className="flex gap-2">
          {LOCAL_ACTION_BUTTONS.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default" || btn.type === "bulkAdd" || btn.type === "addToAllRoom"}>
                  <Modal
                    title="Thêm tài sản phòng"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size="icon" variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={
                      btn.type === "bulkAdd"
                        ? handleBulkAddRoomAsset
                        : btn.type === "addToAllRoom"
                        ? handleAddToAllRoom
                        : handleAddRoomAsset
                    }
                  >
                    <AddOrUpdateRoomAsset
                      handleChange={handleChange}
                      value={value}
                      bulkValue={bulkValue}
                      setBulkValue={setBulkValue}
                      setValue={setValue}
                      allRoomValue={allRoomValue}
                      setAllRoomValue={setAllRoomValue}
                      errors={errors}
                      roomList={roomListData?.data || []}
                      assetsList={assetsListData?.data || []}
                      type={btn.type as "default" | "addToAllRoom" | "update" | "bulkAdd"}
                      buildingOptions={buildingOptions}
                    />
                  </Modal>
                </RenderIf>
                <RenderIf
                  value={
                    btn.type !== "default" &&
                    btn.type !== "bulkAdd" &&
                    btn.type !== "addToAllRoom" &&
                    btn.type !== "upload" &&
                    btn.type !== "download"
                  }
                >
                  <TooltipTrigger asChild>
                    <Button
                      className="cursor-pointer"
                      size="icon"
                      variant={btn.type}
                      onClick={() => handleButton(btn)}
                      disabled={btn.type === "delete" && !Object.values(ids).some(Boolean)}
                    >
                      <btn.icon className="text-white" />
                    </Button>
                  </TooltipTrigger>
                </RenderIf>
                <RenderIf value={btn.type === "download" && type !== "detail"}>
                  <TooltipTrigger asChild>
                    <Button
                      className="cursor-pointer"
                      size="icon"
                      variant={btn.type}
                      onClick={() => handleButton(btn)}
                      disabled={btn.type === "delete" && !Object.values(ids).some(Boolean)}
                    >
                      <btn.icon className="text-white" />
                    </Button>
                  </TooltipTrigger>
                </RenderIf>
                <TooltipContent
                  className="text-white"
                  style={{
                    background: btn.arrowColor,
                  }}
                  arrow={false}
                >
                  <p>{t(btn.tooltipContent)}</p>
                  <TooltipPrimitive.Arrow
                    style={{
                      fill: btn.arrowColor,
                      background: btn.arrowColor,
                    }}
                    className={"size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"}
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
      <ConfirmDialog />
    </div>
  );
};

export default RoomAssetButton;
