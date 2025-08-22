import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

import { Button } from "@/components/ui/button";
import Modal from "@/components/Modal";
import { useCallback, useState } from "react";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent } from "react";
import { toast } from "sonner";
import { Notice, Status } from "@/enums";
import { createOrUpdateService } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import { IBtnType, ServiceCreationRequest, ServiceResponse } from "@/types";
import { ACTION_BUTTONS_HISTORY } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import AddOrUpdateService from "./AddOrUpdateService";
import { useNavigate } from "react-router-dom";
import {
  formatDate,
  formattedCurrency,
  handleExportExcel,
  serviceCalculationEnumToString,
  serviceCategoryEnumToString,
  serviceStatusEnumToString,
} from "@/lib/utils";
import { useTranslation } from "react-i18next";

const ServiceButton = ({ ids, data }: { ids: Record<string, boolean>; data?: ServiceResponse[] }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [value, setValue] = useState<ServiceCreationRequest>({
    description: "",
    name: "",
    price: undefined,
    serviceCalculation: "",
    serviceCategory: "",
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ServiceCreationRequest>();

  const queryClient = useQueryClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addServiceMutation = useMutation({
    mutationKey: ["add-service"],
    mutationFn: async (payload: ServiceCreationRequest) => await httpRequest.post("/services", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValue({
        description: "",
        name: "",
        price: undefined,
        serviceCalculation: "",
        serviceCategory: "",
      });
      queryClient.invalidateQueries({
        predicate: (prev) => {
          return Array.isArray(prev.queryKey) && prev.queryKey[0] === "service";
        },
      });
      queryClient.invalidateQueries({ queryKey: ["service-statistics"] });
    },
  });

  const handleAddService = useCallback(async () => {
    try {
      const { description, name, price, serviceCalculation, serviceCategory } = value;

      await createOrUpdateService.parseAsync(value);

      const data: ServiceCreationRequest = {
        description: description.trim(),
        name: name.trim(),
        price,
        serviceCalculation,
        serviceCategory,
      };

      await addServiceMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addServiceMutation, clearErrors, handleZodErrors, value]);

  const handleRemoveServicesByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeServiceMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service",
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
      return await handleRemoveServicesByIds(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các dịch vụ đã chọn. Bạn có chắc chắn muốn tiếp tục?",
    type: "warn",
  });

  const handleButton = useCallback(
    (btn: IBtnType) => {
      if (btn.type === "delete") {
        openDialog(ids);
      } else if (btn.type === "history") {
        navigate(`/service-management/services/history`);
      } else if (btn.type === "download") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const exportData: Record<string, any>[] | undefined = data?.map((d) => ({
          "Tên dịch vụ": d.name,
          "Loại dịch vụ": serviceCategoryEnumToString(d.serviceCategory, t),
          "Đơn vị": d.unit,
          Giá: formattedCurrency(d.price || 0),
          "Áp dụng theo": serviceCalculationEnumToString(d.serviceCalculation, t),
          "Trạng thái": serviceStatusEnumToString(d.status, t),
          "Mô tả": d.description,
          "Ngày tạo": formatDate(new Date(d.createdAt)),
          "Ngày cập nhật": formatDate(new Date(d.updatedAt)),
        }));
        handleExportExcel(`Dịch vụ`, exportData, data);
      }
    },
    [data, ids, navigate, openDialog, t]
  );

  const removeServiceMutation = useMutation({
    mutationKey: ["remove-service"],
    mutationFn: async (id: string) => await httpRequest.put(`/service/soft-delete/${id}`),
  });

  return (
    <div className="h-full bg-background rounded-t-sm">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Dịch vụ</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS_HISTORY.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Dịch vụ"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddService}
                  >
                    <AddOrUpdateService
                      type="add"
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

export default ServiceButton;
