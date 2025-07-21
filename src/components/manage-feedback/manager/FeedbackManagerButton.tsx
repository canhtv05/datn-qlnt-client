
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { IBtnType } from "@/types";
import { useConfirmDialog } from "@/hooks";
import {  Status } from "@/enums";
import { ACTION_BUTTONS } from "@/constant";
import { toast } from "sonner";
import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpRequest } from "@/utils/httpRequest";

interface Props {
  ids: Record<string, boolean>;
}

const FeedbackManagerButton = ({ ids }: Props) => {
  const queryClient = useQueryClient();

  const deleteFeedbackMutation = useMutation({
    mutationKey: ["delete-feedbacks-manager"],
    mutationFn: async (ids: string[]) =>
      await httpRequest.delete("/feed-backs", { data: ids }),
    onSuccess: () => {
      toast.success(Status.REMOVE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["feedbacks-manager"] });
    },
    onError: () => {
      toast.error("Xoá phản hồi thất bại");
    },
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<Record<string, boolean>>({
    onConfirm: async (selectedIds) => {
      try {
        const idList = Object.entries(selectedIds)
          .filter(([, checked]) => checked)
          .map(([id]) => id);
        if (idList.length === 0) return false;

        await deleteFeedbackMutation.mutateAsync(idList);
        return true;
      } catch {
        return false;
      }
    },
    desc: "Bạn có chắc chắn muốn xoá các phản hồi đã chọn?",
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
        <h3 className="font-semibold">Phản hồi</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS.filter((b) => b.type === "delete").map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant={btn.type}
                    onClick={() => handleButton(btn)}
                    disabled={
                      btn.type === "delete" && !Object.values(ids).some(Boolean)
                    }
                  >
                    <btn.icon className="text-white" />
                  </Button>
                </TooltipTrigger>
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

export default FeedbackManagerButton;
