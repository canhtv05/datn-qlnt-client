import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import RenderIf from "@/components/RenderIf";
import Modal from "@/components/Modal";
import AddOrUpdateTenantFeedback from "./AddOrUpdateTenantFeedback";

import { FeedbackFormValue, IBtnType, Option } from "@/types";
import { useConfirmDialog } from "@/hooks";
import { useFormErrors } from "@/hooks/useFormErrors";
import { Notice, Status } from "@/enums";
import { ACTION_BUTTONS } from "@/constant";
import { toast } from "sonner";

import { useCallback, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpRequest } from "@/utils/httpRequest";
import { createOrUpdateFeedbackSchema } from "@/lib/validation";

interface Props {
  ids: Record<string, boolean>;
  roomOptions: Option[];
  tenantOptions: Option[];
}

const FeedbackTenantButton = ({ ids, roomOptions, tenantOptions }: Props) => {
  const [value, setValue] = useState<FeedbackFormValue>({
    rating: 5,
    feedbackType: null,
    content: "",
    roomId: "",
    tenantId: "",
  });
  const queryClient = useQueryClient();
  const { errors, clearErrors, handleZodErrors } = useFormErrors<FeedbackFormValue>();

  const addFeedbackMutation = useMutation({
    mutationKey: ["add-feedback"],
    mutationFn: async (payload: FeedbackFormValue) =>
      await httpRequest.post("/feed-backs", payload),
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValue({ rating: 5, feedbackType: null, content: "", roomId: "", tenantId: "" });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "feedbacks",
      });
    },
    onError: () => toast.error("Thêm phản hồi thất bại"),
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<Record<string, boolean>>({
    onConfirm: async (selectedIds) => {
      try {
        const idList = Object.entries(selectedIds)
          .filter(([, checked]) => checked)
          .map(([id]) => id);
        if (idList.length === 0) return false;

        await httpRequest.delete("/feed-backs", { data: idList });
        toast.success(Status.REMOVE_SUCCESS);
        queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
        return true;
      } catch {
        toast.error("Xoá phản hồi thất bại");
        return false;
      }
    },
    desc: "Bạn có chắc chắn muốn xoá các phản hồi đã chọn?",
    type: "warn",
  });

  const handleAddFeedback = async () => {
    try {
      await createOrUpdateFeedbackSchema.parseAsync(value);
      await addFeedbackMutation.mutateAsync(value);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  };

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
        <h3 className="font-semibold">Phản hồi</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Thêm phản hồi"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size="icon" variant={btn.type}>
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddFeedback}
                  >
                    <AddOrUpdateTenantFeedback
                      value={value}
                      setValue={setValue}
                      errors={errors}
                      roomOptions={roomOptions}
                      tenantOptions={tenantOptions}
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
                  style={{ background: btn.arrowColor }}
                  arrow={false}
                >
                  <p>{btn.tooltipContent}</p>
                  <TooltipPrimitive.Arrow
                    style={{
                      fill: btn.arrowColor,
                      background: btn.arrowColor,
                    }}
                    className="size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
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

export default FeedbackTenantButton;