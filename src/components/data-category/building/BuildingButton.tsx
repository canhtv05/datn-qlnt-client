import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import Modal from "@/components/Modal";
import AddBuilding from "./AddBuilding";
import { useCallback, useState } from "react";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent } from "react";
import { toast } from "sonner";
import { Status } from "@/enums";
import { useAuthStore } from "@/zustand/authStore";
import { createBuildingSchema } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import { useFullAddress } from "@/hooks/useFullAddress";
import { ICreateBuildingValue } from "@/types";
import { ACTION_BUTTONS } from "@/constant";

type AddData = ICreateBuildingValue & { userId: string | undefined };

const BuildingButton = () => {
  const user = useAuthStore((s) => s.user);
  const [value, setValue] = useState<ICreateBuildingValue>({
    actualNumberOfFloors: undefined,
    address: "",
    buildingCode: "",
    buildingName: "",
    buildingType: undefined,
    description: "",
    numberOfFloorsForRent: undefined,
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ICreateBuildingValue>();
  const { fullAddress, Address } = useFullAddress();

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
        buildingCode: "",
        buildingName: "",
        buildingType: undefined,
        description: "",
        numberOfFloorsForRent: undefined,
      });
    },
  });

  const handleAddBuilding = useCallback(async () => {
    try {
      const {
        actualNumberOfFloors,
        buildingCode,
        buildingName,
        buildingType,
        description,
        address,
        numberOfFloorsForRent,
      } = value;

      await createBuildingSchema.parseAsync(value);

      const data: AddData = {
        userId: user?.id,
        address: `${address}, ${fullAddress}`,
        buildingName,
        buildingCode,
        actualNumberOfFloors,
        buildingType,
        description,
        numberOfFloorsForRent,
      };

      await addBuildingMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addBuildingMutation, clearErrors, fullAddress, handleZodErrors, user?.id, value]);

  return (
    <div className="h-full bg-background rounded-t-sm mt-4">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Tòa nhà</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <Modal
                  title="Dự án/Tòa nhà"
                  trigger={
                    <TooltipTrigger asChild>
                      <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                        <btn.icon className="text-white" />
                      </Button>
                    </TooltipTrigger>
                  }
                  onConfirm={handleAddBuilding}
                >
                  <AddBuilding
                    handleChange={handleChange}
                    value={value}
                    setValue={setValue}
                    errors={errors}
                    address={<Address />}
                  />
                </Modal>
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
    </div>
  );
};

export default BuildingButton;
