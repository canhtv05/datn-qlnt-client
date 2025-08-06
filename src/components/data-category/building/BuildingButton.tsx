import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import Modal from "@/components/Modal";
import AddOrUpdateBuilding from "./AddOrUpdateBuilding";
import { useCallback, useState } from "react";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent } from "react";
import { toast } from "sonner";
import { Notice, Status } from "@/enums";
import { useAuthStore } from "@/zustand/authStore";
import { createOrUpdateBuildingSchema } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
// import { useFullAddress } from "@/hooks/useFullAddress";
import { IBtnType, ICreateBuildingValue } from "@/types";
import { ACTION_BUTTONS_HISTORY } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import { useNavigate } from "react-router-dom";

type AddData = ICreateBuildingValue & { userId: string | undefined };

const BuildingButton = ({ ids }: { ids: Record<string, boolean> }) => {
  const user = useAuthStore((s) => s.user);
  const [value, setValue] = useState<ICreateBuildingValue>({
    actualNumberOfFloors: undefined,
    address: "",
    buildingName: "",
    buildingType: undefined,
    description: "",
    numberOfFloorsForRent: undefined,
  });
  const navigate = useNavigate();

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ICreateBuildingValue>();
  // const { fullAddress, Address, clearValue } = useFullAddress();

  const queryClient = useQueryClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addBuildingMutation = useMutation({
    mutationKey: ["add-building"],
    mutationFn: async (payload: AddData) => await httpRequest.post("/buildings", payload),
    onError: (error) => {
      handleMutationError(error);
    },
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValue({
        actualNumberOfFloors: undefined,
        address: "",
        buildingName: "",
        buildingType: undefined,
        description: "",
        numberOfFloorsForRent: undefined,
      });
      // clearValue();
      queryClient.invalidateQueries({
        predicate: (prev) => {
          return Array.isArray(prev.queryKey) && prev.queryKey[0] === "buildings";
        },
      });
      queryClient.invalidateQueries({ queryKey: ["building-statistics"] });
    },
  });

  const handleAddBuilding = useCallback(async () => {
    try {
      const { actualNumberOfFloors, buildingName, buildingType, description, address, numberOfFloorsForRent } = value;

      await createOrUpdateBuildingSchema.parseAsync(value);

      const data: AddData = {
        userId: user?.id,
        // address: `${address}, ${fullAddress}`,
        address: address.trim(),
        buildingName: buildingName.trim(),
        actualNumberOfFloors,
        buildingType,
        description: description.trim(),
        numberOfFloorsForRent,
      };

      await addBuildingMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addBuildingMutation, clearErrors, handleZodErrors, user?.id, value]);

  const handleRemoveBuildingByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeBuildingMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "buildings",
      });
      queryClient.invalidateQueries({ queryKey: ["building-statistics"] });

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
      return await handleRemoveBuildingByIds(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các tòa nhà đã chọn. Bạn có chắc chắn muốn tiếp tục?",
    type: "warn",
  });

  const handleButton = useCallback(
    (btn: IBtnType) => {
      if (btn.type === "delete") {
        openDialog(ids);
      } else if (btn.type === "history") {
        navigate(`/facilities/buildings/history`);
      }
    },
    [ids, navigate, openDialog]
  );

  const removeBuildingMutation = useMutation({
    mutationKey: ["remove-building"],
    mutationFn: async (id: string) => await httpRequest.put(`/buildings/soft-delete/${id}`),
  });

  return (
    <div className="h-full bg-background rounded-t-sm">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Tòa nhà</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS_HISTORY.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Tòa nhà"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddBuilding}
                  >
                    <AddOrUpdateBuilding
                      handleChange={handleChange}
                      value={value}
                      setValue={setValue}
                      errors={errors}
                      // address={<Address />}
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

export default BuildingButton;
