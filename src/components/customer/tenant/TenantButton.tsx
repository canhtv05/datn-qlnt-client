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
import { createOrUpdateTenantSchema, formatFullName } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import { IBtnType, ICreateAndUpdateTenant } from "@/types";
import { ACTION_BUTTONS_HISTORY } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import AddOrUpdateTenant from "./AddOrUpdateTenant";
import { useNavigate } from "react-router-dom";

const TenantButton = ({ ids }: { ids: Record<string, boolean> }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState<ICreateAndUpdateTenant>({
    address: "",
    dob: "",
    email: "",
    fullName: "",
    gender: "",
    identityCardNumber: "",
    phoneNumber: "",
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ICreateAndUpdateTenant>();

  const queryClient = useQueryClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = () => {
    setValue((prev) => ({
      ...prev,
      fullName: formatFullName(prev.fullName),
    }));
  };

  const addTenantMutation = useMutation({
    mutationKey: ["add-tenant"],
    mutationFn: async (payload: ICreateAndUpdateTenant) => await httpRequest.post("/tenants/owner", payload),
    onError: (error) => {
      handleMutationError(error);
    },
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValue({
        address: "",
        dob: "",
        email: "",
        fullName: "",
        gender: "",
        identityCardNumber: "",
        phoneNumber: "",
      });
      queryClient.invalidateQueries({
        predicate: (prev) => {
          return Array.isArray(prev.queryKey) && prev.queryKey[0] === "tenants";
        },
      });
      queryClient.invalidateQueries({ queryKey: ["tenants-statistics"] });
    },
  });

  const handleAddTenant = useCallback(async () => {
    try {
      const { address, dob, email, fullName, gender, identityCardNumber, phoneNumber } = value;

      const data: ICreateAndUpdateTenant = {
        address: address.trim(),
        dob,
        email: email.trim(),
        fullName: fullName.trim(),
        gender,
        identityCardNumber: identityCardNumber.trim(),
        phoneNumber: phoneNumber.trim(),
      };

      await createOrUpdateTenantSchema.parseAsync(value);
      await addTenantMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addTenantMutation, clearErrors, handleZodErrors, value]);

  const handleRemoveTenantsByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeTenantsMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "tenants",
      });
      queryClient.invalidateQueries({ queryKey: ["tenants-statistics"] });

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
      return await handleRemoveTenantsByIds(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các khách thuê đã chọn. Bạn có chắc chắn muốn tiếp tục?",
    type: "warn",
  });

  const handleButton = useCallback(
    (btn: IBtnType) => {
      if (btn.type === "delete") {
        openDialog(ids);
      } else if (btn.type === "history") {
        navigate(`/customers/tenants/history`);
      }
    },
    [ids, navigate, openDialog]
  );

  const removeTenantsMutation = useMutation({
    mutationKey: ["remove-tenants"],
    mutationFn: async (id: string) => await httpRequest.put(`/vehicles/soft/${id}`),
  });

  return (
    <div className="h-full bg-background rounded-t-sm">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Khách thuê</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS_HISTORY.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Khách thuê"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddTenant}
                  >
                    <AddOrUpdateTenant
                      onBlur={handleBlur}
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
                  <p>{btn.tooltipContent}</p>
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

export default TenantButton;
