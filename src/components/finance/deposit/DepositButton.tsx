import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { useCallback } from "react";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Status } from "@/enums";
import { DepositDetailView, IBtnType } from "@/types";
import { ACTION_BUTTONS } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import { depositStatusEnumToString, formatDate, formatNumber, handleExportExcel } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const DepositButton = ({ ids, data }: { data?: DepositDetailView[]; ids: Record<string, boolean> }) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const removeDepositMutation = useMutation({
    mutationKey: ["remove-deposit"],
    mutationFn: async (id: string) => await httpRequest.delete(`/deposits/${id}`),
  });

  const handleRemoveAssetTypeByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeDepositMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "deposits",
      });
      // queryClient.invalidateQueries({ queryKey: ["meter-statistics"] });

      toast.success(t(Status.REMOVE_SUCCESS));
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
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các tiền cọc đã chọn. Bạn có chắc chắn muốn tiếp tục?",
    type: "warn",
  });

  const handleButton = useCallback(
    (btn: IBtnType) => {
      if (btn.type === "delete") {
        openDialog(ids);
      }
      if (btn.type === "download") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const exportData: Record<string, any>[] | undefined = data?.map((d) => ({
          "Mã đặt cọc": d.id,
          "Mã hợp đồng": d.contractCode,
          "Mã phòng": d.roomCode,
          "Người đặt cọc": d.depositor,
          "Người nhận cọc": d.depositRecipient,
          "Số tiền cọc": formatNumber(d.depositAmount),
          "Trạng thái cọc": depositStatusEnumToString(d.depositStatus, t),
          "Ngày đặt cọc": formatDate(d.depositDate),
          "Ngày hoàn trả": formatDate(d.depositRefundDate),
          "Ngày trả lại tiền đặt cọc": formatDate(d.securityDepositReturnDate),
          "Ghi chú": d.note,
          "Ngày tạo": formatDate(d.createdAt),
          "Ngày cập nhật": formatDate(d.updatedAt),
        }));

        handleExportExcel("Tiền cọc", exportData, data);
      }
    },
    [openDialog, ids, data, t]
  );

  return (
    <div className="h-full bg-background rounded-t-sm">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Tiền cọc</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
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

export default DepositButton;
