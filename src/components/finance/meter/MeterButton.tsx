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
import { createOrUpdateMeterSchema } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import { ApiResponse, CreateMeterInitResponse, IBtnType, MeterCreationAndUpdatedRequest } from "@/types";
import { ACTION_BUTTONS } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import AddOrUpdateMeter from "./AddOrUpdateMeter";
import { ChartNoAxesCombined } from "lucide-react";
import { useNavigate } from "react-router-dom";

const MeterButton = ({
  ids,
  meterInit,
}: {
  ids: Record<string, boolean>;
  meterInit: ApiResponse<CreateMeterInitResponse> | undefined;
}) => {
  const navigate = useNavigate();

  const [value, setValue] = useState<MeterCreationAndUpdatedRequest>({
    descriptionMeter: "",
    initialIndex: undefined,
    manufactureDate: "",
    meterCode: "",
    meterName: "",
    meterType: "",
    roomId: "",
    serviceId: "",
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<MeterCreationAndUpdatedRequest>();

  const queryClient = useQueryClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addMeterMutation = useMutation({
    mutationKey: ["add-meter"],
    mutationFn: async (payload: MeterCreationAndUpdatedRequest) => await httpRequest.post("/meters", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValue({
        descriptionMeter: "",
        initialIndex: undefined,
        manufactureDate: "",
        meterCode: "",
        meterName: "",
        meterType: "",
        roomId: "",
        serviceId: "",
      });
      queryClient.invalidateQueries({
        predicate: (prev) => {
          return Array.isArray(prev.queryKey) && prev.queryKey[0] === "meters";
        },
      });
      // queryClient.invalidateQueries({ queryKey: ["meter-statistics"] });
    },
  });

  const handleMeterType = useCallback(async () => {
    try {
      const { descriptionMeter, initialIndex, manufactureDate, meterCode, meterName, meterType, roomId, serviceId } =
        value;

      await createOrUpdateMeterSchema.parseAsync(value);

      const data: MeterCreationAndUpdatedRequest = {
        descriptionMeter: descriptionMeter.trim(),
        initialIndex: initialIndex || 0,
        manufactureDate,
        meterCode: meterCode.trim(),
        meterName: meterName.trim(),
        meterType,
        roomId: roomId.trim(),
        serviceId: serviceId.trim(),
      };

      await addMeterMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addMeterMutation, clearErrors, handleZodErrors, value]);

  const handleRemoveAssetTypeByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeMeterMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "meters",
      });
      // queryClient.invalidateQueries({ queryKey: ["meter-statistics"] });

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
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các loại công tơ đã chọn. Bạn có chắc chắn muốn tiếp tục?",
    type: "warn",
  });

  const handleButton = useCallback(
    (btn: IBtnType) => {
      if (btn.type === "delete") {
        openDialog(ids);
      }
      if (btn.type === "view") {
        navigate("/finance/meters/statistics");
      }
    },
    [ids, navigate, openDialog]
  );

  const removeMeterMutation = useMutation({
    mutationKey: ["remove-meters"],
    mutationFn: async (id: string) => await httpRequest.delete(`/meters/${id}`),
  });

  const statisticButton: IBtnType[] = [
    {
      type: "view",
      arrowColor: "var(--color-emerald-500)",
      hasConfirm: false,
      icon: ChartNoAxesCombined,
      tooltipContent: "Xem thống kê",
    },
  ];
  const ACTION_BUTTONS_CUSTOM = [...statisticButton, ...ACTION_BUTTONS];

  return (
    <div className="h-full bg-background rounded-t-sm">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Công tơ</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS_CUSTOM.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Công tơ"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleMeterType}
                  >
                    <AddOrUpdateMeter
                      meterInit={meterInit}
                      handleChange={handleChange}
                      value={value}
                      setValue={setValue}
                      errors={errors}
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

export default MeterButton;
