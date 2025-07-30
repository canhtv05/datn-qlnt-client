import { useState, useCallback, ChangeEvent } from "react";
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
import { IBtnType, ApiResponse, RoomAssetFormValue, RoomResponse, AssetResponse } from "@/types";
import { AssetBeLongTo, Notice, Status } from "@/enums";
import { httpRequest } from "@/utils/httpRequest";
import { roomAssetFormSchema } from "@/lib/validation";
import { handleMutationError } from "@/utils/handleMutationError";

const RoomAssetButton = ({ ids }: { ids: Record<string, boolean> }) => {
  const [value, setValue] = useState<RoomAssetFormValue>({
    assetBeLongTo: "PHONG",
    roomId: "",
    assetId: "",
    assetName: "",
    price: 0,
    description: "",
  });

  // const { id: buildingId } = useParams();
  const { errors, clearErrors, handleZodErrors } = useFormErrors<RoomAssetFormValue>();
  const queryClient = useQueryClient();

  const { data: roomListData } = useQuery<ApiResponse<RoomResponse[]>>({
    queryKey: ["room-list"],
    queryFn: async () => {
      const res = await httpRequest.get("/rooms/all"
      );
      return res.data;
    },
  });

  const { data: assetsListData } = useQuery<ApiResponse<AssetResponse[]>>({
    queryKey: ["assets"],
    queryFn: async () => {
      const res = await httpRequest.get("/assets"
      );
      return res.data.data;
    },
  });


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };

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
      });
      queryClient.invalidateQueries({ queryKey: ["asset-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-asset-statistics"] });
    },
  });

  const handleAddRoomAsset = useCallback(async () => {
    try {
      const fullValue = {
        ...value,
      };
      await roomAssetFormSchema.parseAsync(fullValue);
      await addRoomAssetMutation.mutateAsync(fullValue);
      clearErrors();
      return true;
    } catch (error) {
      console.log("Error adding room asset:", error);
      handleZodErrors(error);
      return false;
    }
  }, [value, addRoomAssetMutation, clearErrors, handleZodErrors]);

  const removeRoomAssetMutation = useMutation({
    mutationKey: ["remove-room-asset"],
    mutationFn: async (id: string) => await httpRequest.put(`/asset-rooms/${id}`),
  });

  const handleRemoveRoomAsset = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        .filter(([, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeRoomAssetMutation.mutateAsync(id)));

      toast.success(Status.REMOVE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["asset-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-asset-statistics"] });

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
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các phòng đã chọn. Bạn có chắc chắn muốn tiếp tục?",
    type: "warn",
  });

  const handleButton = useCallback(
    (btn: IBtnType) => {
      if (btn.type === "delete") {
        openDialog(ids);
      }
    },
    [ids, openDialog]
  );

  return (
    <div className="h-full bg-background rounded-t-sm mt-4">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Tài sản phòng</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Thêm tài sản phòng"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size="icon" variant={btn.type}>
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddRoomAsset}
                  >
                    <AddOrUpdateRoomAsset
                      handleChange={handleChange}
                      value={value}
                      setValue={setValue}
                      errors={errors}
                      roomList={roomListData?.data || []}
                      assetsList={assetsListData?.data || []}
                    />
                  </Modal>
                </RenderIf>
                <RenderIf value={btn.type !== "default"}>
                  <TooltipTrigger asChild>
                    <Button
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
                  <p>{btn.tooltipContent}</p>
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
