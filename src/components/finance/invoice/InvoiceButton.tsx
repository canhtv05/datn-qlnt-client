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
import {
  createInvoiceForBuildingSchema,
  createInvoiceForContractSchema,
  createInvoiceForFloorSchema,
} from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import {
  ApiResponse,
  ContractResponse,
  IBtnType,
  IdAndName,
  InvoiceBuildingCreationRequest,
  InvoiceCreationRequest,
  InvoiceFloorCreationRequest,
} from "@/types";
import { ACTION_BUTTONS } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import AddInvoice from "./AddInvoice";
import { format } from "date-fns";
import { Building, Building2, FileText, Plus } from "lucide-react";

const InvoiceButton = ({
  ids,
  contractInitToAdd,
  buildingInitToAdd,
  floorInitToAdd,
}: {
  ids: Record<string, boolean>;
  contractInitToAdd: ApiResponse<ContractResponse[]> | undefined;
  buildingInitToAdd: ApiResponse<IdAndName[]> | undefined;
  floorInitToAdd: ApiResponse<IdAndName[]> | undefined;
}) => {
  const [valueContract, setValueContract] = useState<InvoiceCreationRequest>({
    contractId: "",
    note: "",
    paymentDueDate: "",
  });

  const [valueBuilding, setValueBuilding] = useState<InvoiceBuildingCreationRequest>({
    buildingId: "",
    note: "",
    paymentDueDate: "",
  });

  const [valueFloor, setValueFloor] = useState<InvoiceFloorCreationRequest>({
    floorId: "",
    note: "",
    paymentDueDate: "",
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<InvoiceCreationRequest>();

  const queryClient = useQueryClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValueContract((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addInvoiceForContractMutation = useMutation({
    mutationKey: ["add-invoice"],
    mutationFn: async (payload: InvoiceCreationRequest) => await httpRequest.post("/invoices/by-contract", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValueContract({
        contractId: "",
        note: "",
        paymentDueDate: "",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "invoices",
      });
      queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });
    },
  });

  const handleAddInvoiceForContract = useCallback(async () => {
    try {
      const { contractId, note, paymentDueDate } = valueContract;

      await createInvoiceForContractSchema.parseAsync(valueContract);

      const data: InvoiceCreationRequest = {
        contractId: contractId.trim(),
        note: note.trim(),
        paymentDueDate: format(paymentDueDate, "yyyy-MM-dd"),
      };

      await addInvoiceForContractMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addInvoiceForContractMutation, clearErrors, handleZodErrors, valueContract]);

  const handleRemoveInvoiceForContractByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeInvoiceMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "invoices",
      });
      queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });

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
      return await handleRemoveInvoiceForContractByIds(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu hóa đơn đã chọn. Bạn có chắc chắn muốn tiếp tục?",
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

  const removeInvoiceMutation = useMutation({
    mutationKey: ["remove-invoices"],
    mutationFn: async (id: string) => await httpRequest.put(`/invoices/soft/${id}`),
  });

  const addInvoiceBuildingMutation = useMutation({
    mutationKey: ["add-invoice-building"],
    mutationFn: async (payload: InvoiceBuildingCreationRequest) =>
      await httpRequest.post("/invoices/by-building", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValueBuilding({
        buildingId: "",
        note: "",
        paymentDueDate: "",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "invoices",
      });
      queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });
    },
  });

  const handleAddInvoiceForBuilding = useCallback(async () => {
    try {
      const { buildingId, note, paymentDueDate } = valueBuilding;

      await createInvoiceForBuildingSchema.parseAsync(valueBuilding);

      const data: InvoiceBuildingCreationRequest = {
        buildingId: buildingId.trim(),
        note: note.trim(),
        paymentDueDate: format(paymentDueDate, "yyyy-MM-dd"),
      };

      await addInvoiceBuildingMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addInvoiceBuildingMutation, clearErrors, handleZodErrors, valueBuilding]);

  const addInvoiceFloorMutation = useMutation({
    mutationKey: ["add-invoice-floor"],
    mutationFn: async (payload: InvoiceFloorCreationRequest) => await httpRequest.post("/invoices/by-floor", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValueFloor({
        floorId: "",
        note: "",
        paymentDueDate: "",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "invoices",
      });
      queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });
    },
  });

  const handleAddInvoiceForFloor = useCallback(async () => {
    try {
      const { floorId, note, paymentDueDate } = valueFloor;

      await createInvoiceForFloorSchema.parseAsync(valueFloor);

      const data: InvoiceFloorCreationRequest = {
        floorId: floorId.trim(),
        note: note.trim(),
        paymentDueDate: format(paymentDueDate, "yyyy-MM-dd"),
      };

      await addInvoiceFloorMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addInvoiceFloorMutation, clearErrors, handleZodErrors, valueFloor]);

  const ADD_BUTTON: IBtnType[] = [
    {
      icon: Building2,
      arrowColor: "var(--color-sky-500)",
      hasConfirm: true,
      tooltipContent: "Tạo hóa đơn tòa nhà",
      type: "building",
    },
    {
      icon: Building,
      arrowColor: "var(--color-teal-400)",
      hasConfirm: true,
      tooltipContent: "Tạo hóa đơn tầng nhà",
      type: "floor",
    },
    {
      icon: FileText,
      arrowColor: "var(--color-indigo-500)",
      hasConfirm: true,
      tooltipContent: "Tạo hóa đơn hợp đồng",
      type: "contract",
    },
    {
      icon: Plus,
      arrowColor: "var(--color-primary)",
      hasConfirm: true,
      tooltipContent: "Tạo hóa đơn cuối cùng",
      type: "finalize",
    },
  ];
  const ACTIONS_BUTTON_CUSTOM = [...ADD_BUTTON, ...ACTION_BUTTONS];

  return (
    <div className="h-full bg-background rounded-t-sm">
      <div className="flex md:flex-row flex-col px-4 py-3 justify-between items-center">
        <h3 className="font-semibold md:py-0 py-3 text-2xl md:text-[16px]">Hóa đơn</h3>
        <div className="flex gap-2">
          {ACTIONS_BUTTON_CUSTOM.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "contract"}>
                  <Modal
                    title="Tạo hóa đơn hợp đồng"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddInvoiceForContract}
                  >
                    <AddInvoice
                      contractInitToAdd={contractInitToAdd}
                      handleChange={handleChange}
                      value={valueContract}
                      setValue={setValueContract}
                      errors={errors}
                      type="contract"
                    />
                  </Modal>
                </RenderIf>
                <RenderIf value={btn.type === "building"}>
                  <Modal
                    title="Tạo hóa đơn tòa nhà"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddInvoiceForBuilding}
                  >
                    <AddInvoice
                      buildingInitToAdd={buildingInitToAdd}
                      handleChange={handleChange}
                      value={valueBuilding}
                      setValue={setValueBuilding}
                      errors={errors}
                      type="building"
                    />
                  </Modal>
                </RenderIf>
                <RenderIf value={btn.type === "floor"}>
                  <Modal
                    title="Tạo hóa đơn tầng nhà"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddInvoiceForFloor}
                  >
                    <AddInvoice
                      floorInitToAdd={floorInitToAdd}
                      handleChange={handleChange}
                      value={valueFloor}
                      setValue={setValueFloor}
                      errors={errors}
                      type="floor"
                    />
                  </Modal>
                </RenderIf>
                <RenderIf value={btn.type === "finalize"}>
                  <Modal
                    title="Tạo hóa đơn cuối cùng"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddInvoiceForContract}
                  >
                    <AddInvoice
                      contractInitToAdd={contractInitToAdd}
                      handleChange={handleChange}
                      value={valueContract}
                      setValue={setValueContract}
                      errors={errors}
                      type="finalize"
                    />
                  </Modal>
                </RenderIf>
                <RenderIf
                  value={
                    btn.type !== "contract" &&
                    btn.type !== "default" &&
                    btn.type !== "floor" &&
                    btn.type !== "building" &&
                    btn.type !== "finalize"
                  }
                >
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

export default InvoiceButton;
