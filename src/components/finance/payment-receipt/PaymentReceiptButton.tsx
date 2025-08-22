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
import { IBtnType, PaymentReceiptResponse } from "@/types";
import { ACTION_BUTTONS } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import {
  formatDate,
  formattedCurrency,
  handleExportExcel,
  receiptMethodEnumToString,
  receiptStatusEnumToString,
} from "@/lib/utils";
import { useTranslation } from "react-i18next";

const PaymentReceiptButton = ({ ids, data }: { data?: PaymentReceiptResponse[]; ids: Record<string, boolean> }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const sendPaymentNoticeMutation = useMutation({
    mutationKey: ["send-payment-notice"],
    mutationFn: async () => await httpRequest.post("/payment-receipts/send-payment-notice"),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      queryClient.invalidateQueries({
        predicate: (prev) => {
          return Array.isArray(prev.queryKey) && prev.queryKey[0] === "payment-receipts";
        },
      });
    },
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<Record<string, boolean>>({
    onConfirm: async (ids?: Record<string, boolean>) => {
      if (!ids || !Object.values(ids).some(Boolean)) return false;
      return await handleRemovePaymentReceiptByIds(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các phiếu thanh toán đã chọn. Bạn có chắc chắn muốn tiếp tục?",
    type: "warn",
  });

  const { ConfirmDialog: ConfirmDialogSendPaymentNotice, openDialog: openDialogSendPaymentNotice } = useConfirmDialog({
    onConfirm: async () => {
      return await handleSendPaymentNotice();
    },
    desc: "Thao tác này sẽ tạo phiếu thanh toán. Bạn có chắc chắn muốn tiếp tục không?",
    type: "default",
  });

  const handleButton = useCallback(
    (btn: IBtnType) => {
      if (btn.type === "delete" || btn.type === "default") {
        openDialog(ids);
      } else if (btn.type === "download") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const exportData: Record<string, any>[] | undefined = data?.map((d) => ({
          "Mã phiếu": d.receiptCode,
          "Mã hóa đơn": d.invoiceCode,
          "Số tiền": formattedCurrency(d.amount),
          "Phương thức thanh toán": receiptMethodEnumToString(d.paymentMethod, t),
          "Trạng thái thanh toán": receiptStatusEnumToString(d.paymentStatus, t),
          "Người thu": d.collectedBy,
          "Ngày thanh toán": formatDate(d.paymentDate) !== "" ? formatDate(d.paymentDate) : "Chưa thanh toán",
          "Ghi chú": d.note,
          "Ngày tạo": formatDate(d.createdAt),
          "Ngày cập nhật": formatDate(d.updatedAt),
        }));
        handleExportExcel(`Phiếu thanh toán`, exportData, data);
      }
    },
    [data, ids, openDialog, t]
  );

  const handleSendPaymentNotice = useCallback(async () => {
    try {
      await sendPaymentNoticeMutation.mutateAsync();
      return true;
    } catch {
      return false;
    }
  }, [sendPaymentNoticeMutation]);

  const handleRemovePaymentReceiptByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removePaymentReceiptMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "payment-receipts",
      });

      toast.success(Status.REMOVE_SUCCESS);
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const removePaymentReceiptMutation = useMutation({
    mutationKey: ["remove-payment-receipt"],
    mutationFn: async (id: string) => await httpRequest.delete(`/payment-receipts/${id}`),
  });

  return (
    <div className="h-full bg-background rounded-t-sm">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Phiếu thanh toán</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => openDialogSendPaymentNotice()}
                    >
                      <btn.icon className="text-white" />
                    </Button>
                  </TooltipTrigger>
                </RenderIf>
                <RenderIf value={btn.type === "delete" || btn.type === "download"}>
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
      <ConfirmDialogSendPaymentNotice />
    </div>
  );
};

export default PaymentReceiptButton;
