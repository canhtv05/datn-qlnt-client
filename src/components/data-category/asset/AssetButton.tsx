import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import Modal from "@/components/Modal";
import { useCallback, useEffect, useMemo, useState } from "react";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent } from "react";
import { toast } from "sonner";
import { Notice, Status } from "@/enums";
import { useFormErrors } from "@/hooks/useFormErrors";
import { ApiResponse, AssetResponse, IBtnType, ICreateAsset, IdAndName } from "@/types";
import { ACTION_BUTTONS_HISTORY } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import AddOrUpdateAsset from "./AddOrUpdateAsset";
import RoomAssetButton from "../room-assets/RoomAssetButton";
import { useNavigate, useParams } from "react-router-dom";
import { creationAssetSchema } from "@/lib/validation";
import {
  assetBelongToEnumToString,
  assetTypeEnumToString,
  formatDate,
  formattedCurrency,
  handleExportExcel,
} from "@/lib/utils";
import { useTranslation } from "react-i18next";

const AssetButton = ({ ids, data }: { ids: Record<string, boolean>; data?: AssetResponse[] }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [value, setValue] = useState<ICreateAsset>({
    nameAsset: "",
    assetType: "",
    assetBeLongTo: "",
    price: 0,
    descriptionAsset: "",
    buildingId: "",
    quantity: undefined,
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ICreateAsset>();

  const queryClient = useQueryClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addAssetMutation = useMutation({
    mutationKey: ["add-asset"],
    mutationFn: async (payload: ICreateAsset) => await httpRequest.post("/assets", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(t(Status.ADD_SUCCESS));
      setValue({
        nameAsset: "",
        assetType: "",
        assetBeLongTo: "",
        price: 0,
        descriptionAsset: "",
        buildingId: "",
        quantity: undefined,
      });
      queryClient.invalidateQueries({
        predicate: (prev) => {
          return Array.isArray(prev.queryKey) && prev.queryKey[0] === "assets";
        },
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "asset-statistics",
      });
    },
  });

  const handleAddAssetType = useCallback(async () => {
    try {
      const { assetBeLongTo, assetType, descriptionAsset, nameAsset, price, quantity } = value;

      const data: ICreateAsset = {
        nameAsset: nameAsset.trim(),
        assetType: assetType ?? "",
        assetBeLongTo: assetBeLongTo ?? "",
        price: price ?? 0,
        descriptionAsset: descriptionAsset.trim() ?? "",
        buildingId: id ?? "",
        quantity,
      };

      if (!id) {
        toast.error(t("asset.noBuildingId"));
        return false;
      }

      await creationAssetSchema.parseAsync(data);
      await addAssetMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addAssetMutation, clearErrors, handleZodErrors, id, t, value]);

  const handleRemoveAssetTypeByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeAssetTypeMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "assets",
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "asset-statistics",
      });

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
    desc: t("common.confirmDialog.delete", { name: t("asset.title") }),
    type: "warn",
  });

  const handleButton = useCallback(
    (btn: IBtnType) => {
      if (btn.type === "delete") {
        openDialog(ids);
      } else if (btn.type === "history") {
        navigate(`/asset-management/assets/history`);
      } else if (btn.type === "download") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const exportData: Record<string, any>[] | undefined = data?.map((d) => ({
          [t("asset.response.nameAsset")]: d.nameAsset,
          [t("asset.response.assetType")]: assetTypeEnumToString(d.assetType, t),
          [t("asset.response.assetBeLongTo")]: assetBelongToEnumToString(d.assetBeLongTo, t),
          [t("asset.response.price")]: formattedCurrency(d.price),
          [t("asset.response.quantity")]: d.quantity,
          [t("asset.response.remainingQuantity")]: d.remainingQuantity,
          [t("asset.response.description")]: d.description,
          [t("asset.response.createdAt")]: formatDate(new Date(d.createdAt)),
          [t("asset.response.updatedAt")]: formatDate(new Date(d.updatedAt)),
        }));
        handleExportExcel(`t("asset.title")${data?.[0].buildingName}`, exportData, data);
      }
    },
    [data, ids, navigate, openDialog, t]
  );

  const removeAssetTypeMutation = useMutation({
    mutationKey: ["remove-assets"],
    mutationFn: async (id: string) => await httpRequest.put(`/assets/soft-delete/${id}`),
  });

  const { data: buildingInitToAdd, isError: errorBuildingInitToAdd } = useQuery<
    ApiResponse<IdAndName[]>
  >({
    queryKey: ["buildingInitToAdd"],
    queryFn: async () => {
      const res = await httpRequest.get("/buildings/all");
      return res.data;
    },
    retry: false,
  });

  const buildingOptions = useMemo(() => {
    return (
      buildingInitToAdd?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      })) ?? []
    );
  }, [buildingInitToAdd?.data]);

  useEffect(() => {
    if (errorBuildingInitToAdd) {
      toast.error(t(t("building.errorFetch")));
    }
  }, [errorBuildingInitToAdd, t]);

  return (
    <div className="h-full bg-background rounded-t-sm">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">{t("asset.title")}</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS_HISTORY.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Tài sản"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={t(Notice.ADD)}
                    onConfirm={handleAddAssetType}
                  >
                    <AddOrUpdateAsset
                      handleChange={handleChange}
                      value={value}
                      setValue={setValue}
                      errors={errors}
                      type="add"
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
          <RoomAssetButton ids={{}} roomId="" type="asset" buildingOptions={buildingOptions} />
        </div>
      </div>
      <ConfirmDialog />
    </div>
  );
};

export default AssetButton;
