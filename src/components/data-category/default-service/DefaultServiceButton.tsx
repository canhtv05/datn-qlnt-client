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
import { creationDefaultServiceSchema } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import { ApiResponse, DefaultServiceCreationRequest, DefaultServiceInitResponse, IBtnType } from "@/types";
import { ACTION_BUTTONS } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import AddOrUpdateDefaultService from "./AddOrUpdateDefaultService";

const DefaultServiceButton = ({
  ids,
  defaultServiceInit,
}: {
  ids: Record<string, boolean>;
  defaultServiceInit: ApiResponse<DefaultServiceInitResponse> | undefined;
}) => {
  const [value, setValue] = useState<DefaultServiceCreationRequest>({
    buildingId: "",
    defaultServiceAppliesTo: "",
    defaultServiceStatus: "",
    description: "",
    floorId: "",
    pricesApply: undefined,
    serviceId: "",
    startApplying: "",
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<DefaultServiceCreationRequest>();

  const queryClient = useQueryClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addDefaultServiceMutation = useMutation({
    mutationKey: ["add-default-services"],
    mutationFn: async (payload: DefaultServiceCreationRequest) => await httpRequest.post("/default-services", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValue({
        buildingId: "",
        defaultServiceAppliesTo: "",
        defaultServiceStatus: "",
        description: "",
        floorId: "",
        pricesApply: undefined,
        serviceId: "",
        startApplying: "",
      });
      queryClient.invalidateQueries({
        predicate: (prev) => {
          return Array.isArray(prev.queryKey) && prev.queryKey[0] === "default-services";
        },
      });
      queryClient.invalidateQueries({ queryKey: ["default-services-statistics"] });
    },
  });

  const handleAddDefaultService = useCallback(async () => {
    try {
      const {
        buildingId,
        defaultServiceAppliesTo,
        defaultServiceStatus,
        description,
        floorId,
        pricesApply,
        serviceId,
        startApplying,
      } = value;

      await creationDefaultServiceSchema.parseAsync(value);

      const data: DefaultServiceCreationRequest = {
        buildingId,
        defaultServiceAppliesTo,
        defaultServiceStatus,
        description: description.trim(),
        floorId,
        pricesApply,
        serviceId,
        startApplying,
      };

      await addDefaultServiceMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addDefaultServiceMutation, clearErrors, handleZodErrors, value]);

  const handleRemoveAssetTypeByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeDefaultServicesMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "asset-types",
      });
      queryClient.invalidateQueries({ queryKey: ["default-services-statistics"] });

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
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các dịch vụ mặc định đã chọn. Bạn có chắc chắn muốn tiếp tục?",
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

  const removeDefaultServicesMutation = useMutation({
    mutationKey: ["remove-default-services"],
    mutationFn: async (id: string) => await httpRequest.put(`/default-services/soft-delete/${id}`),
  });

  return (
    <div className="h-full bg-background rounded-t-sm mt-4">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Dịch vụ mặc định</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Dịch vụ mặc định"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddDefaultService}
                  >
                    <AddOrUpdateDefaultService
                      type="add"
                      handleChange={handleChange}
                      value={value}
                      setValue={setValue}
                      errors={errors}
                      defaultServiceInit={defaultServiceInit}
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

export default DefaultServiceButton;
