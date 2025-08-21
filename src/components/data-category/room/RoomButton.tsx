import { useState, useCallback, ChangeEvent } from "react";
import { toast } from "sonner";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import Modal from "@/components/Modal";
import AddOrUpdateRoom from "./AddOrUpdateRoom";
import { useFormErrors } from "@/hooks/useFormErrors";
import { useConfirmDialog } from "@/hooks";
import { ACTION_BUTTONS_HISTORY } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { IBtnType, RoomFormValue, ApiResponse, FloorBasicResponse, RoomResponse } from "@/types";
import { Notice, RoomStatus, Status } from "@/enums";
import { httpRequest } from "@/utils/httpRequest";
import { createOrUpdateRoomSchema } from "@/lib/validation";
import { handleMutationError } from "@/utils/handleMutationError";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate, handleExportExcel, roomStatusEnumToString, roomTypeEnumToString } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const RoomButton = ({ ids, data }: { ids: Record<string, boolean>; data: RoomResponse[] | undefined }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [value, setValue] = useState<RoomFormValue>({
    floorId: "",
    acreage: null,
    price: null,
    roomType: null,
    maximumPeople: null,
    description: "",
    status: null,
  });

  const { id: buildingId } = useParams();
  const { errors, clearErrors, handleZodErrors } = useFormErrors<RoomFormValue>();
  const queryClient = useQueryClient();

  const { data: floorListData } = useQuery<ApiResponse<FloorBasicResponse[]>>({
    queryKey: ["floor-list", buildingId],
    queryFn: async () => {
      const res = await httpRequest.get("/floors/find-all", {
        params: { buildingId },
      });
      return res.data;
    },
    enabled: !!buildingId,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({ ...prev, [name]: value }));
  };

  const addRoomMutation = useMutation({
    mutationKey: ["add-room"],
    mutationFn: async (payload: RoomFormValue) => await httpRequest.post("/rooms", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValue({
        floorId: "",
        acreage: null,
        price: null,
        roomType: null,
        maximumPeople: null,
        description: "",
        status: null,
      });
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-statistics"] });
    },
  });

  const handleAddRoom = useCallback(async () => {
    try {
      const fullValue = {
        ...value,
        status: RoomStatus.TRONG,
        buildingId,
      };
      await createOrUpdateRoomSchema.parseAsync(fullValue);
      await addRoomMutation.mutateAsync(fullValue);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [value, buildingId, addRoomMutation, clearErrors, handleZodErrors]);

  const removeRoomMutation = useMutation({
    mutationKey: ["remove-room"],
    mutationFn: async (id: string) => await httpRequest.put(`/rooms/soft-delete/${id}`),
  });

  const handleRemoveRooms = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        .filter(([, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeRoomMutation.mutateAsync(id)));

      toast.success(Status.REMOVE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["room-statistics"] });

      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const { ConfirmDialog, openDialog } = useConfirmDialog<Record<string, boolean>>({
    onConfirm: async (ids?: Record<string, boolean>) => {
      if (!ids || !Object.values(ids).some(Boolean)) return false;
      return await handleRemoveRooms(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các phòng đã chọn. Bạn có chắc chắn muốn tiếp tục?",
    type: "warn",
  });

  const handleButton = useCallback(
    (btn: IBtnType) => {
      if (btn.type === "delete") {
        openDialog(ids);
      } else if (btn.type === "history") {
        navigate(`/facilities/rooms/history`);
      } else if (btn.type === "download") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const exportData: Record<string, any>[] | undefined = data?.map((d) => ({
          "Mã phòng": d.roomCode,
          "Diện tích": `${d.acreage}m²`,
          "Số người tối đa": d.maximumPeople,
          "Loại phòng": roomTypeEnumToString(d.roomType),
          "Mô tả": d.description,
          "Trạng thái": roomStatusEnumToString(d.status),
          "Ngày tạo": formatDate(new Date(d.createdAt)),
          "Ngày cập nhật": formatDate(new Date(d.updatedAt)),
        }));
        handleExportExcel(`Phòng_${data?.[0]?.floor?.buildingName}`, exportData, data);
      }
    },
    [data, ids, navigate, openDialog]
  );

  return (
    <div className="h-full bg-background rounded-t-sm">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Phòng</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS_HISTORY.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Thêm phòng"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size="icon" variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddRoom}
                  >
                    <AddOrUpdateRoom
                      handleChange={handleChange}
                      value={value}
                      setValue={setValue}
                      errors={errors}
                      floorList={floorListData?.data || []}
                      type="add"
                    />
                  </Modal>
                </RenderIf>
                <RenderIf value={btn.type !== "default"}>
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

export default RoomButton;
