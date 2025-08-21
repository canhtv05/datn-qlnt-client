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
import { Notice, Status, VehicleStatus } from "@/enums";
import { createVehicleSchema } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import TenantResponse, { ApiResponse, IBtnType, ICreateVehicle, VehicleResponse } from "@/types";
import { ACTION_BUTTONS_HISTORY } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import AddOrUpdateVehicle from "./AddOrUpdateVehicle";
import { useNavigate } from "react-router-dom";
import { formatDate, handleExportExcel, vehicleStatusEnumToString, vehicleTypeEnumToString } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const VehicleButton = ({
  ids,
  tenants,
  data,
}: {
  ids: Record<string, boolean>;
  tenants?: ApiResponse<TenantResponse[]>;
  data?: VehicleResponse[];
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [value, setValue] = useState<ICreateVehicle>({
    describe: "",
    licensePlate: "",
    registrationDate: formatDate(new Date()),
    vehicleStatus: VehicleStatus.SU_DUNG,
    vehicleType: "",
    tenantId: "",
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ICreateVehicle>();

  const queryClient = useQueryClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addVehicleMutation = useMutation({
    mutationKey: ["add-vehicle"],
    mutationFn: async (payload: ICreateVehicle) => await httpRequest.post("/vehicles", payload),
    onError: (error) => {
      handleMutationError(error);
    },
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValue({
        describe: "",
        licensePlate: "",
        registrationDate: "",
        vehicleStatus: "",
        vehicleType: "",
        tenantId: "",
      });
      queryClient.invalidateQueries({
        predicate: (prev) => {
          return Array.isArray(prev.queryKey) && prev.queryKey[0] === "vehicles";
        },
      });
      queryClient.invalidateQueries({ queryKey: ["vehicles-statistics"] });
    },
  });

  const handleAddFloor = useCallback(async () => {
    try {
      const { describe, licensePlate, registrationDate, tenantId, vehicleStatus, vehicleType } = value;

      await createVehicleSchema.parseAsync(value);

      const data: ICreateVehicle = {
        describe: describe.trim(),
        licensePlate: licensePlate.trim(),
        registrationDate,
        tenantId,
        vehicleStatus,
        vehicleType,
      };

      await addVehicleMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addVehicleMutation, clearErrors, handleZodErrors, value]);

  const handleRemoveVehiclesByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeVehicleMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "vehicles",
      });
      queryClient.invalidateQueries({ queryKey: ["vehicles-statistics"] });

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
      return await handleRemoveVehiclesByIds(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu phương tiện đã chọn. Bạn có chắc chắn muốn tiếp tục?",
    type: "warn",
  });

  const handleButton = useCallback(
    (btn: IBtnType) => {
      if (btn.type === "delete") {
        openDialog(ids);
      } else if (btn.type === "history") {
        navigate(`/customers/vehicles/history`);
      } else if (btn.type === "download") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const exportData: Record<string, any>[] | undefined = data?.map((d) => ({
          "Chủ sở hữu": d.fullName,
          "Loại phương tiện": vehicleTypeEnumToString(d.vehicleType, t),
          "Biển số": d.licensePlate,
          "Trạng thái": vehicleStatusEnumToString(d.vehicleStatus, t),
          "Ngày đăng ký": formatDate(d.registrationDate),
          "Mô tả": d.describe,
          "Ngày tạo": formatDate(d.createdAt),
          "Ngày cập nhật": formatDate(d.updatedAt),
        }));
        handleExportExcel(`Phương tiện`, exportData, data);
      }
    },
    [data, ids, navigate, openDialog, t]
  );

  const removeVehicleMutation = useMutation({
    mutationKey: ["remove-vehicles"],
    mutationFn: async (id: string) => await httpRequest.put(`/vehicles/soft-delete/${id}`),
  });

  return (
    <div className="h-full bg-background rounded-t-sm">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Phương tiện</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS_HISTORY.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Phương tiện"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddFloor}
                  >
                    <AddOrUpdateVehicle
                      handleChange={handleChange}
                      value={value}
                      setValue={setValue}
                      errors={errors}
                      tenants={tenants}
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
        </div>
      </div>
      <ConfirmDialog />
    </div>
  );
};

export default VehicleButton;
