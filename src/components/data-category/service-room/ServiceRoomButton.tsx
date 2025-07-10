import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import Modal from "@/components/Modal";
import { useCallback, useState } from "react";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent } from "react";
import { toast } from "sonner";
import { Notice, Status } from "@/enums";
import { createServiceRoomSchema } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import { ApiResponse, CreateRoomServiceInitResponse, IBtnType, ServiceRoomCreationRequest } from "@/types";
import { ACTION_BUTTONS } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import AddOrUpdateServiceRoom from "./AddOrUpdateServiceRoom";

const ServiceRoomButton = ({
  ids,
  serviceRoomInit,
}: {
  ids: Record<string, boolean>;
  serviceRoomInit?: ApiResponse<CreateRoomServiceInitResponse>;
}) => {
  const [value, setValue] = useState<ServiceRoomCreationRequest>({
    descriptionServiceRoom: "",
    roomId: "",
    serviceId: "",
    startDate: "",
    totalPrice: undefined,
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ServiceRoomCreationRequest>();

  const queryClient = useQueryClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addServiceRoomMutation = useMutation({
    mutationKey: ["add-service-room"],
    mutationFn: async (payload: ServiceRoomCreationRequest) => await httpRequest.post("/service-rooms", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValue({
        descriptionServiceRoom: "",
        roomId: "",
        serviceId: "",
        startDate: "",
        totalPrice: undefined,
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms",
      });
      queryClient.invalidateQueries({ queryKey: ["service-rooms-statistics"] });
    },
  });

  const handleAddServiceRoom = useCallback(async () => {
    try {
      const { descriptionServiceRoom, roomId, serviceId, startDate, totalPrice } = value;

      const data: ServiceRoomCreationRequest = {
        descriptionServiceRoom: descriptionServiceRoom.trim(),
        roomId: roomId ?? "",
        serviceId: serviceId ?? "",
        startDate,
        totalPrice,
      };

      await createServiceRoomSchema.parseAsync(data);
      await addServiceRoomMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addServiceRoomMutation, clearErrors, handleZodErrors, value]);

  const handleRemoveAssetTypeByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeServiceRoomMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms",
      });
      queryClient.invalidateQueries({ queryKey: ["service-rooms-statistics"] });

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
      return await handleRemoveAssetTypeByIds(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các dịch vụ phòng đã chọn. Bạn có chắc chắn muốn tiếp tục?",
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

  const removeServiceRoomMutation = useMutation({
    mutationKey: ["remove-service-rooms"],
    mutationFn: async (id: string) => await httpRequest.put(`/service-rooms/soft-delete/${id}`),
  });

  return (
    <div className="h-full bg-background rounded-t-sm mt-4">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Dịch vụ phòng</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Dịch vụ phòng"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddServiceRoom}
                  >
                    <AddOrUpdateServiceRoom
                      serviceRoomInit={serviceRoomInit}
                      handleChange={handleChange}
                      value={value}
                      setValue={setValue}
                      errors={errors}
                      type="add"
                    />
                  </Modal>
                </RenderIf>
                <RenderIf value={btn.type !== "default"}>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={btn.type}
                      className="cursor-pointer"
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

export default ServiceRoomButton;
