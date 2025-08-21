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
import { createMeterReadingSchema } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import {
  ApiResponse,
  IBtnType,
  MeterFindAllResponse,
  MeterReadingCreationRequest,
  MeterReadingResponse,
} from "@/types";
import { ACTION_BUTTONS } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import AddOrUpdateMeterReading from "./AddOrUpdateMeterReading";
import { formatDate, formatNumber, handleExportExcel, meterTypeEnumToString } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const MeterReadingButton = ({
  ids,
  meterInitResponse,
  data,
}: {
  data?: MeterReadingResponse[];
  ids: Record<string, boolean>;
  meterInitResponse: ApiResponse<MeterFindAllResponse> | undefined;
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<MeterReadingCreationRequest>({
    descriptionMeterReading: "",
    meterId: "",
    newIndex: 0,
    month: 1,
    year: new Date().getFullYear(),
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<MeterReadingCreationRequest>();

  const queryClient = useQueryClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addMeterReadingMutation = useMutation({
    mutationKey: ["add-meter-reading"],
    mutationFn: async (payload: MeterReadingCreationRequest) => await httpRequest.post("/meter-readings", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValue({
        descriptionMeterReading: "",
        meterId: "",
        newIndex: 0,
        month: 1,
        year: new Date().getFullYear(),
      });
      queryClient.invalidateQueries({
        predicate: (prev) => {
          return Array.isArray(prev.queryKey) && prev.queryKey[0] === "meter-readings";
        },
      });
    },
  });

  const handleMeterReadingType = useCallback(async () => {
    try {
      const { descriptionMeterReading, meterId, newIndex, year, month } = value;

      const data: MeterReadingCreationRequest = {
        descriptionMeterReading: descriptionMeterReading.trim(),
        meterId: meterId.trim(),
        newIndex: newIndex || 0,
        month: month || 0,
        year: year || new Date().getFullYear(),
      };

      await createMeterReadingSchema.parseAsync(data);
      await addMeterReadingMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addMeterReadingMutation, clearErrors, handleZodErrors, value]);

  const handleRemoveMeterReadingByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeMeterReadingMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "meter-readings",
      });

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
      return await handleRemoveMeterReadingByIds(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các ghi chỉ số đã chọn. Bạn có chắc chắn muốn tiếp tục?",
    type: "warn",
  });

  const handleButton = useCallback(
    (btn: IBtnType) => {
      if (btn.type === "delete") {
        openDialog(ids);
      } else if (btn.type === "download") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const exportData: Record<string, any>[] | undefined = data?.map((d) => ({
          "Mã công tơ": d.meterCode,
          "Tên công tơ": d.meterName,
          "Loại công tơ": meterTypeEnumToString(d.meterType),
          "Chỉ số cũ": formatNumber(d.oldIndex),
          "Chỉ số mới": formatNumber(d.newIndex),
          "Số lượng": formatNumber(d.quantity),
          Tháng: d.month,
          Năm: d.year,
          "Ngày ghi chỉ số": formatDate(d.readingDate),
          "Mô tả": d.descriptionMeterReading,
          "Ngày tạo": formatDate(d.createdAt),
          "Ngày cập nhật": formatDate(d.updatedAt),
        }));
        handleExportExcel(`Ghi chỉ số`, exportData, data);
      }
    },
    [data, ids, openDialog]
  );

  const removeMeterReadingMutation = useMutation({
    mutationKey: ["remove-meter-readings"],
    mutationFn: async (id: string) => await httpRequest.delete(`/meter-readings/${id}`),
  });

  return (
    <div className="h-full bg-background rounded-t-sm">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Ghi chỉ số</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Ghi chỉ số"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleMeterReadingType}
                  >
                    <AddOrUpdateMeterReading
                      type="add"
                      handleChange={handleChange}
                      value={value}
                      setValue={setValue}
                      errors={errors}
                      meterInitReading={meterInitResponse}
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

export default MeterReadingButton;
