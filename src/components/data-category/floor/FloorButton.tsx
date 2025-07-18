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
import { createFloorSchema } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import { IBtnType, ICreateFloorValue } from "@/types";
import { ACTION_BUTTONS } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import AddOrUpdateFloor from "./AddOrUpdateFloor";
import { useParams } from "react-router-dom";

const FloorButton = ({ ids }: { ids: Record<string, boolean> }) => {
  const [value, setValue] = useState<ICreateFloorValue>({
    descriptionFloor: "",
    floorType: undefined,
    maximumRoom: undefined,
    nameFloor: "",
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ICreateFloorValue>();

  const queryClient = useQueryClient();

  const { id } = useParams();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addFloorMutation = useMutation({
    mutationKey: ["add-floor"],
    mutationFn: async (payload: ICreateFloorValue) => await httpRequest.post("/floors", payload),
    onError: (error) => {
      handleMutationError(error);
    },
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValue({
        descriptionFloor: "",
        floorType: undefined,
        maximumRoom: undefined,
        nameFloor: "",
      });
      queryClient.invalidateQueries({
        predicate: (prev) => {
          return Array.isArray(prev.queryKey) && prev.queryKey[0] === "floors";
        },
      });
      queryClient.invalidateQueries({ queryKey: ["floors-statistics"] });
    },
  });

  const handleAddFloor = useCallback(async () => {
    try {
      const { descriptionFloor, floorType, maximumRoom, nameFloor } = value;

      await createFloorSchema.parseAsync(value);

      if (!id) {
        toast.error(Status.ERROR);
        return false;
      }

      const data: ICreateFloorValue & { buildingId: string } = {
        buildingId: id,
        descriptionFloor: descriptionFloor.trim(),
        floorType,
        maximumRoom,
        nameFloor: nameFloor.trim(),
      };

      await addFloorMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addFloorMutation, id, clearErrors, handleZodErrors, value]);

  const handleRemoveFloorsByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeFloorMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "floors",
      });
      queryClient.invalidateQueries({ queryKey: ["floors-statistics"] });

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
      return await handleRemoveFloorsByIds(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các tầng đã chọn. Bạn có chắc chắn muốn tiếp tục?",
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

  const removeFloorMutation = useMutation({
    mutationKey: ["remove-floors"],
    mutationFn: async (id: string) => await httpRequest.put(`/floors/soft-delete/${id}`),
  });

  return (
    <div className="h-full bg-background rounded-t-sm mt-4">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Tầng</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Tầng"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddFloor}
                  >
                    <AddOrUpdateFloor
                      handleChange={handleChange}
                      value={value}
                      setValue={setValue}
                      errors={errors}
                      type="update"
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

export default FloorButton;
