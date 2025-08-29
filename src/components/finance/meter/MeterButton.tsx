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
import {
  ApiResponse,
  CreateMeterInitResponse,
  IBtnType,
  MeterCreationAndUpdatedRequest,
  MeterResponse,
  PaginatedResponse,
} from "@/types";
import { ACTION_BUTTONS } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import AddOrUpdateMeter from "./AddOrUpdateMeter";
import { useNavigate, useParams } from "react-router-dom";
import { formatDate, formatNumber, handleExportExcel, meterTypeEnumToString } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { Eye } from "lucide-react";

const MeterButton = ({
  ids,
  meterInit,
  data,
}: {
  data?: PaginatedResponse<MeterResponse[]>;
  ids: Record<string, boolean>;
  meterInit: ApiResponse<CreateMeterInitResponse> | undefined;
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [value, setValue] = useState<MeterCreationAndUpdatedRequest>({
    descriptionMeter: "",
    closestIndex: 0,
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
      toast.success(t(Status.ADD_SUCCESS));
      setValue({
        descriptionMeter: "",
        closestIndex: undefined,
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
      const { descriptionMeter, closestIndex, manufactureDate, meterCode, meterName, meterType, roomId, serviceId } =
        value;

      const data: MeterCreationAndUpdatedRequest = {
        descriptionMeter: descriptionMeter.trim(),
        closestIndex: closestIndex || 0,
        manufactureDate,
        meterCode: meterCode.trim(),
        meterName: meterName.trim(),
        meterType,
        roomId: roomId.trim(),
        serviceId: serviceId.trim(),
      };
      await createOrUpdateMeterSchema.parseAsync(value);
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
    desc: t("common.confirmDialog.delete", { name: t("meter.title") }),
    type: "warn",
  });

  const { id } = useParams();

  const handleButton = useCallback(
    (btn: IBtnType) => {
      if (btn.type === "delete") {
        openDialog(ids);
      }
      if (btn.type === "view" && id) {
        navigate(`/finance/meters/statistics/${id}`);
      } else if (btn.type === "download") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const exportData: Record<string, any>[] | undefined = data?.data?.map((d) => ({
          [t("meter.response.meterCode")]: d.meterCode,
          [t("meter.response.meterName")]: d.meterName,
          [t("meter.response.serviceName")]: d.serviceName,
          [t("meter.response.meterType")]: meterTypeEnumToString(d.meterType, t),
          [t("meter.response.closestIndex")]: formatNumber(d.closestIndex),
          [t("meter.response.room")]: d.roomCode,
          [t("meter.response.describe")]: d.descriptionMeter,
          [t("meter.response.manufactureDate")]: formatDate(d.manufactureDate),
          [t("meter.response.createdAt")]: formatDate(d.createdAt),
          [t("meter.response.updatedAt")]: formatDate(d.updatedAt),
        }));

        handleExportExcel(t("meter.title"), exportData, data?.data);
      } else if (btn.type === "contract") {
        navigate(`/finance/meters/no-meter`);
      }
    },
    [id, openDialog, ids, navigate, data?.data, t]
  );

  const removeMeterMutation = useMutation({
    mutationKey: ["remove-meters"],
    mutationFn: async (id: string) => await httpRequest.delete(`/meters/${id}`),
  });

  // tạm thời bỏ phần này
  // const statisticButton: IBtnType[] = [
  //   {
  //     type: "view",
  //     arrowColor: "var(--color-emerald-500)",
  //     hasConfirm: false,
  //     icon: ChartNoAxesCombined,
  //     tooltipContent: "Xem thống kê",
  //   },
  // ];

  const viewNoMeterBtn: IBtnType[] = [
    {
      type: "contract",
      arrowColor: "var(--color-purple-600)",
      hasConfirm: false,
      icon: Eye,
      tooltipContent: t("meter.viewNoMeter"),
    },
  ];

  const ACTION_BUTTONS_CUSTOM = [...viewNoMeterBtn, ...ACTION_BUTTONS];

  return (
    <div className="h-full bg-background rounded-t-sm">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">{t("meter.title")}</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS_CUSTOM.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title={t("meter.title")}
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={t(Notice.ADD)}
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

export default MeterButton;
