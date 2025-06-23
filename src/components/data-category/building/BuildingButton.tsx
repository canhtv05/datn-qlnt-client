import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Download, LucideIcon, Plus, Trash2, Upload } from "lucide-react";
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
import { BuildingType, Status } from "@/enums";
import { useAuthStore } from "@/zustand/authStore";
import { createBuildingSchema } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import { useFullAddress } from "@/hooks/useFullAddress";

interface AddValue {
  buildingCode: string;
  buildingName: string;
  address: string;
  actualNumberOfFloors: number | undefined;
  numberOfFloorsForRent: number | undefined;
  buildingType: BuildingType | undefined;
  description: string;
}

type AddData = AddValue & { userId: string | undefined };

interface BtnType {
  tooltipContent: string;
  icon: LucideIcon;
  arrowColor: string;
  type: "default" | "upload" | "delete" | "download";
  hasConfirm: boolean;
}

const btns: BtnType[] = [
  {
    tooltipContent: "Thêm mới",
    icon: Plus,
    arrowColor: "var(--color-primary)",
    type: "default",
    hasConfirm: true,
  },
  {
    tooltipContent: "Tải lên Excel",
    icon: Upload,
    arrowColor: "var(--color-amber-500)",
    type: "upload",
    hasConfirm: false,
  },
  {
    tooltipContent: "Tải xuống Excel",
    icon: Download,
    arrowColor: "var(--color-emerald-500)",
    type: "download",
    hasConfirm: false,
  },
  {
    tooltipContent: "Xóa",
    icon: Trash2,
    arrowColor: "var(--color-red-400)",
    type: "delete",
    hasConfirm: true,
  },
];

const BuildingButton = () => {
  const user = useAuthStore((s) => s.user);
  const [value, setValue] = useState<AddValue>({
    actualNumberOfFloors: undefined,
    address: "",
    buildingCode: "",
    buildingName: "",
    buildingType: undefined,
    description: "",
    numberOfFloorsForRent: undefined,
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<AddValue>();
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

  console.log(value);

  return (
    <div className="h-full bg-background rounded-t-sm mt-4">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Tòa nhà</h3>
        <div className="flex gap-2">
          {btns.map((btn, index) => (
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
