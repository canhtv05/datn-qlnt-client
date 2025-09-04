import { Link, useParams } from "react-router-dom";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import {
  AssetLittleResponse,
  ContractDetailResponse,
  ContractExtendAndTerminateRequest,
  ServiceLittleResponse,
  TenantLittleResponse,
  VehicleBasicResponse,
} from "@/types";
import { httpRequest } from "@/utils/httpRequest";

import "@/assets/css/print.css";
import "ckeditor5/ckeditor5.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  assetBelongToEnumToString,
  assetStatusEnumToString,
  contractStatusEnumToString,
  formatDate,
  formatLocalDate,
  formattedCurrency,
  genderEnumToString,
  serviceRoomStatusEnumToString,
  vehicleTypeEnumToString,
} from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/zustand/authStore";
import { Button } from "@/components/ui/button";
import { Ban, CalendarX, Eye, RotateCcw } from "lucide-react";
import Tooltip from "@/components/ToolTip";
import RenderIf from "@/components/RenderIf";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { handleMutationError } from "@/utils/handleMutationError";
import { useCallback, useState } from "react";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { extendContractSchema, noticeContractSchema } from "@/lib/validation";
import Modal from "@/components/Modal";
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip as TT } from "@/components/ui/tooltip";
import { ContractStatus } from "@/enums";
import ExtendOrNoticeContract from "./ExtendOrNoticeContract";

const ContractDetailPage = () => {
  const queryClient = useQueryClient();
  const { contractId } = useParams();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery<ContractDetailResponse>({
    queryKey: ["contract-detail", contractId],
    queryFn: async () => (await httpRequest.get(`/contracts/${contractId}`)).data.data,
    enabled: !!contractId,
    retry: 1,
  });
  const { user } = useAuthStore((s) => s);

  const [value, setValue] = useState<ContractExtendAndTerminateRequest>({
    newEndDate: "",
    oldEndDate: "",
  });
  const { clearErrors, errors, handleZodErrors } = useFormErrors<ContractExtendAndTerminateRequest>();

  const extendContractMutation = useMutation({
    mutationFn: (payload: ContractExtendAndTerminateRequest) =>
      httpRequest.post(`/contracts/extend/${data?.id || contractId}`, payload),
    onSuccess: () => {
      setValue({ newEndDate: "", oldEndDate: "" });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["contract-detail"] });
      toast.success(t("contract.extend"));
    },
    onError: handleMutationError,
  });

  const handleExtendContract = useCallback(async () => {
    try {
      const { newEndDate, oldEndDate } = value;

      const data: ContractExtendAndTerminateRequest = {
        newEndDate: formatLocalDate(newEndDate),
        oldEndDate,
      };

      await extendContractSchema.parseAsync(data);
      await extendContractMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [value, extendContractMutation, clearErrors, handleZodErrors]);

  const noticeContractMutation = useMutation({
    mutationFn: (payload: ContractExtendAndTerminateRequest) =>
      httpRequest.post(`/contracts/terminate-with-notice/${data?.id || contractId}`, payload),
    onSuccess: () => {
      setValue({ newEndDate: "", oldEndDate: "" });
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["contract-detail"] });
      toast.success(t("contract.verifyWithNotice"));
    },
    onError: handleMutationError,
  });

  const handleNoticeContract = useCallback(async () => {
    try {
      const { newEndDate, oldEndDate } = value;

      const data: ContractExtendAndTerminateRequest = {
        newEndDate: formatLocalDate(newEndDate),
        oldEndDate,
      };

      await noticeContractSchema.parseAsync(data);
      await noticeContractMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [value, noticeContractMutation, clearErrors, handleZodErrors]);

  const cancelContractMutation = useMutation({
    mutationFn: () => httpRequest.post(`/contracts/force-cancel/${data?.id || contractId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });
      queryClient.invalidateQueries({ queryKey: ["contract-detail"] });
      toast.success(t("contract.verifyUnilateralCancel"));
    },
    onError: handleMutationError,
  });

  const handleCancelContract = useCallback(async () => {
    await cancelContractMutation.mutateAsync();
    return true;
  }, [cancelContractMutation]);

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ type: "extend" | "notice" | "cancel" }>({
    onConfirm: async ({ type }) => {
      if (type === "extend") {
        return await handleExtendContract();
      } else if (type === "notice") {
        return await handleNoticeContract();
      } else {
        return await handleCancelContract();
      }
    },
  });

  const handleActionClick = useCallback(
    async (type: "extend" | "notice" | "cancel") => {
      const contract = data;
      if (!contract) return await false;
      if (type === "extend") {
        setValue({
          newEndDate: contract.endDate,
          oldEndDate: contract.endDate,
        });
        openDialog({ type });
        return await true;
      } else if (type === "notice") {
        setValue({
          newEndDate: contract.endDate,
          oldEndDate: contract.endDate,
        });
        openDialog({ type });
        return await true;
      } else {
        openDialog({ type }, { desc: t("contract.confirmCancel.desc") });
        return await true;
      }
    },
    [data, openDialog, t]
  );

  return (
    <div>
      <RenderIf value={isLoading}>
        <div className="bg-white dark:bg-background p-5 rounded-md space-y-5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton
              style={{
                background: "var(--color-input)",
              }}
              key={idx}
              className="py-12"
            />
          ))}
        </div>
      </RenderIf>
      <RenderIf value={!isLoading && !!data}>
        <div className="p-6 space-y-6 bg-background rounded-md">
          <div className="bg-input shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">{t("contract.title")}</h2>
            <div className="grid grid-cols-2 text-sm">
              <p>
                <span className="font-medium">{t("contract.contract.contractCode")}:</span> {data?.contractCode}
              </p>
              <p>
                <span className="font-medium">{t("contract.contract.roomCode")}:</span> {data?.roomCode}
              </p>
              <p>
                <span className="font-medium">{t("contract.contract.startDate")}:</span>{" "}
                {data?.startDate ? formatDate(data?.startDate) : ""}
              </p>
              <p>
                <span className="font-medium">{t("contract.contract.endDate")}:</span>{" "}
                {data?.endDate ? formatDate(data?.endDate) : ""}
              </p>
              <p>
                <span className="font-medium">{t("contract.contract.deposit")}:</span>{" "}
                {formattedCurrency(data?.deposit || 0)}
              </p>
              <p>
                <span className="font-medium">{t("contract.contract.roomPrice")}:</span>{" "}
                {formattedCurrency(data?.roomPrice || 0)}
              </p>
              <p>
                <span className="font-medium">{t("contract.contract.buildingAddress")}:</span> {data?.buildingAddress}
              </p>
              <p>
                <span className="font-medium">{t("contract.contract.status")}:</span>{" "}
                {data?.status ? contractStatusEnumToString(data.status, t) : ""}
              </p>
              <p>
                <span className="font-medium">{t("contract.contract.electricPrice")}:</span>{" "}
                {formattedCurrency(data?.electricPrice || 0)}
              </p>
              <p>
                <span className="font-medium">{t("contract.contract.waterPrice")}:</span>{" "}
                {formattedCurrency(data?.waterPrice || 0)}
              </p>
            </div>
          </div>

          <div className="bg-input shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">{t("contract.infoManagerAndMainTenant")}</h2>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 text-sm">
              <div>
                <p>
                  <span className="font-medium">{t("contract.contract.nameManager")}:</span> {data?.nameManager}{" "}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <p>
                  <span className="font-medium">{t("contract.contract.phoneNumberManager")}:</span> {user?.phoneNumber}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">{t("contract.contract.nameUser")}:</span> {data?.nameUser}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {data?.emailUser}
                </p>
                <p>
                  <span className="font-medium">{t("contract.contract.identityCardUser")}:</span>{" "}
                  {data?.identityCardUser}
                </p>
                <p>
                  <span className="font-medium">{t("contract.contract.addressUser")}:</span> {data?.addressUser}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-input shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">{t("contract.contract.tenants")}</h2>
            <ul className="space-y-2 text-sm">
              {data?.tenants?.map((tn: TenantLittleResponse, i: number) => (
                <li key={i} className="border-background border p-3 rounded-lg">
                  <p>
                    <span className="font-medium">{t("tenant.response.fullName")}:</span> {tn.fullName}
                  </p>
                  <p>
                    <span className="font-medium">{t("tenant.response.gender")}:</span>{" "}
                    {genderEnumToString(tn.gender, t)}
                  </p>
                  <p>
                    <span className="font-medium">{t("contract.contract.phoneNumberUser")}:</span> {tn.phoneNumber}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {tn.email}
                  </p>
                  {tn.representative && (
                    <span className="text-green-600 font-semibold"> {t("contract.representative")}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-input shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">{t("contract.contract.assets")}</h2>
            <ul className="space-y-2 text-sm">
              {data?.assets?.map((a: AssetLittleResponse, i: number) => (
                <li key={i} className="border-background border p-3 rounded-lg">
                  <p>
                    <span className="font-medium">{t("asset.response.nameAsset")}:</span> {a.assetName}
                  </p>
                  <p>
                    <span className="font-medium">{t("asset.response.assetBeLongTo")}:</span>{" "}
                    {assetBelongToEnumToString(a.assetBeLongTo, t)}
                  </p>
                  <p>
                    <span className="font-medium">{t("asset.response.quantity")}:</span> {a.quantity}
                  </p>
                  <p>
                    <span className="font-medium">{t("asset.response.price")}:</span> {formattedCurrency(a.price || 0)}
                  </p>
                  <p>
                    <span className="font-medium">{t("asset.response.assetStatus")}:</span>{" "}
                    {assetStatusEnumToString(a.assetStatus, t)}
                  </p>
                  <p>
                    <span className="font-medium">{t("asset.response.descriptionAsset")}:</span> {a.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-input shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">{t("contract.contract.services")}</h2>
            <ul className="space-y-2 text-sm">
              {data?.services?.map((s: ServiceLittleResponse, i: number) => (
                <li key={i} className="border-background border p-3 rounded-lg">
                  <p>
                    <span className="font-medium">{t("service.response.name")}:</span> {s.serviceName}
                  </p>
                  <p>
                    <span className="font-medium">{t("service.response.price")}:</span>{" "}
                    {formattedCurrency(s.unitPrice || 0)}/{s.unit}
                  </p>
                  <p>
                    <span className="font-medium">{t("service.response.status")}:</span>{" "}
                    {serviceRoomStatusEnumToString(s.serviceRoomStatus, t)}
                  </p>
                  <p>
                    <span className="font-medium">{t("service.response.description")}:</span> {s.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-input shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">{t("contract.contract.vehicles")}</h2>
            <ul className="space-y-2 text-sm">
              {data?.vehicles?.map((v: VehicleBasicResponse, i: number) => (
                <li key={i} className="border-background border p-3 rounded-lg">
                  <p>
                    <span className="font-medium">{t("vehicle.response.owner")}:</span> {v.tenantName}
                  </p>
                  <p>
                    <span className="font-medium">{t("vehicle.response.vehicleType")}:</span>{" "}
                    {vehicleTypeEnumToString(v.vehicleType, t)}
                  </p>
                  <p>
                    <span className="font-medium">{t("vehicle.response.licensePlate")}:</span> {v.licensePlate}
                  </p>
                  <p>
                    <span className="font-medium">{t("vehicle.response.describe")}:</span> {v.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex md:flex-row flex-col items-center justify-between">
            <div className="text-xs text-gray-500 text-right">
              <p>
                {t("contract.contract.createdAt")}: {data?.createdAt ? formatDate(data?.createdAt) : ""}
              </p>
              <p>
                {t("contract.contract.updatedAt")}: {data?.updatedAt ? formatDate(data?.updatedAt) : ""}
              </p>
            </div>
            <div className="flex gap-3">
              <RenderIf
                value={
                  data?.status !== ContractStatus.TU_Y_HUY_BO &&
                  data?.status !== ContractStatus.KET_THUC_CO_BAO_TRUOC &&
                  data?.status !== ContractStatus.CHO_KICH_HOAT
                }
              >
                <TooltipProvider>
                  <TT>
                    <Modal
                      title={t("contract.detail.extend")}
                      trigger={
                        <TooltipTrigger asChild>
                          <Button
                            size={"icon"}
                            variant={"status"}
                            className="cursor-pointer"
                            onClick={() => {
                              setValue({
                                newEndDate: data?.endDate || "",
                                oldEndDate: data?.endDate || "",
                              });
                            }}
                          >
                            <RotateCcw className="stroke-white" />
                          </Button>
                        </TooltipTrigger>
                      }
                      desc={t("contract.detail.extendConfirm")}
                      onConfirm={handleExtendContract}
                    >
                      <ExtendOrNoticeContract errors={errors} setValue={setValue} value={value} />
                    </Modal>
                    <TooltipContent
                      className="text-white"
                      style={{
                        background: "var(--color-sky-500)",
                      }}
                      arrow={false}
                    >
                      <p>{t("contract.detail.extend")}</p>
                      <TooltipPrimitive.Arrow
                        style={{
                          fill: "var(--color-sky-500)",
                          background: "var(--color-sky-500)",
                        }}
                        className={"size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"}
                      />
                    </TooltipContent>
                  </TT>
                </TooltipProvider>
                <TooltipProvider>
                  <TT>
                    <Modal
                      title={t("contract.detail.notice")}
                      trigger={
                        <TooltipTrigger asChild>
                          <Button
                            size={"icon"}
                            variant={"cash"}
                            className="cursor-pointer"
                            onClick={() => {
                              setValue({
                                newEndDate: data?.endDate || "",
                                oldEndDate: data?.endDate || "",
                              });
                            }}
                          >
                            <CalendarX className="stroke-white" />
                          </Button>
                        </TooltipTrigger>
                      }
                      desc={t("contract.detail.noticeConfirm")}
                      onConfirm={handleNoticeContract}
                    >
                      <ExtendOrNoticeContract errors={errors} setValue={setValue} value={value} />
                    </Modal>
                    <TooltipContent
                      className="text-white"
                      style={{
                        background: "var(--color-amber-400)",
                      }}
                      arrow={false}
                    >
                      <p>{t("contract.detail.notice")}</p>
                      <TooltipPrimitive.Arrow
                        style={{
                          fill: "var(--color-amber-400)",
                          background: "var(--color-amber-400)",
                        }}
                        className={"size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"}
                      />
                    </TooltipContent>
                  </TT>
                </TooltipProvider>
                <TooltipProvider>
                  <TT>
                    <TooltipTrigger asChild>
                      <Button
                        size={"icon"}
                        variant={"delete"}
                        className="cursor-pointer"
                        onClick={() => handleActionClick("cancel")}
                      >
                        <Ban className="stroke-white" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent
                      className="text-white"
                      style={{
                        background: "var(--color-red-400)",
                      }}
                      arrow={false}
                    >
                      <p>{t("contract.detail.cancel")}</p>
                      <TooltipPrimitive.Arrow
                        style={{
                          fill: "var(--color-red-400)",
                          background: "var(--color-red-400)",
                        }}
                        className={"size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"}
                      />
                    </TooltipContent>
                  </TT>
                </TooltipProvider>
              </RenderIf>

              <Tooltip content={t("contract.viewContent")}>
                <Link to={`/customers/contracts/content/${contractId}`}>
                  <Button size={"icon"}>
                    <Eye className="stroke-white" />
                  </Button>
                </Link>
              </Tooltip>
            </div>
          </div>
        </div>
        <ConfirmDialog />
      </RenderIf>
    </div>
  );
};

export default ContractDetailPage;
