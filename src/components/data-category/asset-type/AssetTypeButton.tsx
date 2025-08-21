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
import { createOrUpdateAssetTypeSchema } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import { IBtnType, ICreateAssetType } from "@/types";
import { ACTION_BUTTONS } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import AddOrUpdateAssetType from "./AddOrUpdateAssetType";
import { useTranslation } from "react-i18next";

const AssetTypeButton = ({ ids }: { ids: Record<string, boolean> }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<ICreateAssetType>({
    assetGroup: "",
    discriptionAssetType: "",
    nameAssetType: "",
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ICreateAssetType>();

  const queryClient = useQueryClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addAssetTypeMutation = useMutation({
    mutationKey: ["add-asset-types"],
    mutationFn: async (payload: ICreateAssetType) => await httpRequest.post("/asset-types", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValue({
        assetGroup: "",
        discriptionAssetType: "",
        nameAssetType: "",
      });
      queryClient.invalidateQueries({
        predicate: (prev) => {
          return Array.isArray(prev.queryKey) && prev.queryKey[0] === "asset-types";
        },
      });
    },
  });

  const handleAddAssetType = useCallback(async () => {
    try {
      const { assetGroup, discriptionAssetType, nameAssetType } = value;

      await createOrUpdateAssetTypeSchema.parseAsync(value);

      const data: ICreateAssetType = {
        assetGroup,
        discriptionAssetType: discriptionAssetType.trim(),
        nameAssetType: nameAssetType.trim(),
      };

      await addAssetTypeMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addAssetTypeMutation, clearErrors, handleZodErrors, value]);

  const handleRemoveAssetTypeByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeAssetTypeMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "asset-types",
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
      return await handleRemoveAssetTypeByIds(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các loại tài sản đã chọn. Bạn có chắc chắn muốn tiếp tục?",
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

  const removeAssetTypeMutation = useMutation({
    mutationKey: ["remove-asset-types"],
    mutationFn: async (id: string) => await httpRequest.delete(`/asset-types/${id}`),
  });

  return (
    <div className="h-full bg-background rounded-t-sm">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Loại tài sản</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Loại tài sản"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddAssetType}
                  >
                    <AddOrUpdateAssetType
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

export default AssetTypeButton;
