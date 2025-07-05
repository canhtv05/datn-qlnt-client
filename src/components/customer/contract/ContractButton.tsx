import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import Modal from "@/components/Modal";
import { useCallback, useState } from "react";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Notice, Status } from "@/enums";
import { createOrUpdateContractSchema } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import { ACTION_BUTTONS } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import AddOrUpdateContract from "./AddOrUpdateContract";
import {
  ApiResponse,
  IBtnType,
  ICreateAndUpdateContract,
  Option,
  RoomResponse,
  TenantBasicResponse,
} from "@/types";

const ContractButton = ({ ids }: { ids: Record<string, boolean> }) => {
  const [value, setValue] = useState<ICreateAndUpdateContract>({
    roomId: "",
    numberOfPeople: 1,
    startDate: new Date(),
    endDate: new Date(),
    deposit: 0,
    tenants: [],
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ICreateAndUpdateContract>();
  const queryClient = useQueryClient();

  const handleChange = useCallback(
    <K extends keyof ICreateAndUpdateContract>(field: K, newValue: ICreateAndUpdateContract[K]) => {
      setValue((prev) => ({ ...prev, [field]: newValue }));
    },
    []
  );

  const addContractMutation = useMutation({
    mutationKey: ["add-contract"],
    mutationFn: async (payload: ICreateAndUpdateContract) =>
      await httpRequest.post("/contracts", payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValue({
        roomId: "",
        numberOfPeople: 1,
        startDate: new Date(),
        endDate: new Date(),
        deposit: 0,
        tenants: [],
      });
      queryClient.invalidateQueries({ predicate: (q) => Array.isArray(q.queryKey) && q.queryKey[0] === "contracts" });
      queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });
    },
  });

  const handleAddContract = useCallback(async () => {
    try {
      await createOrUpdateContractSchema.parseAsync(value);
      await addContractMutation.mutateAsync(value);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addContractMutation, clearErrors, handleZodErrors, value]);

  const removeContractsMutation = useMutation({
    mutationKey: ["remove-contracts"],
    mutationFn: async (id: string) => await httpRequest.put(`/contracts/soft/${id}`),
  });

  const handleRemoveContractsByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        .filter(([, selected]) => selected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeContractsMutation.mutateAsync(id)));

      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });

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
      return await handleRemoveContractsByIds(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các hợp đồng đã chọn. Bạn có chắc chắn muốn tiếp tục?",
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

  // ======== Room + Tenant Options =========
  const { data: roomsData } = useQuery<ApiResponse<RoomResponse[]>>({
    queryKey: ["rooms-all"],
    queryFn: async () => (await httpRequest.get("/rooms/all")).data,
  });

  const { data: tenantsData } = useQuery<ApiResponse<TenantBasicResponse[]>>({
    queryKey: ["tenants-all"],
    queryFn: async () => (await httpRequest.get("/tenants/all")).data,
  });

  const roomOptions: Option[] =
    roomsData?.data?.map((room) => ({
      label: `${room.roomCode}`,
      value: room.id,
    })) || [];

  const tenantOptions: Option[] =
    tenantsData?.data?.map((tenant) => ({
      label: `${tenant.fullName} - ${tenant.phoneNumber}`,
      value: tenant.id,
    })) || [];

  return (
    <div className="h-full bg-background rounded-t-sm mt-4">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Hợp đồng</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Thêm hợp đồng"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size="icon" variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddContract}
                  >
                    <AddOrUpdateContract
                      value={value}
                      errors={errors}
                      handleChange={handleChange}
                      roomOptions={roomOptions}
                      tenantOptions={tenantOptions}
                    />
                  </Modal>
                </RenderIf>
                <RenderIf value={btn.type !== "default"}>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => handleButton(btn)}
                      disabled={btn.type === "delete" && !Object.values(ids).some(Boolean)}
                    >
                      <btn.icon className="text-white" />
                    </Button>
                  </TooltipTrigger>
                </RenderIf>
                <TooltipContent className="text-white" style={{ background: btn.arrowColor }} arrow={false}>
                  <p>{btn.tooltipContent}</p>
                  <TooltipPrimitive.Arrow
                    style={{ fill: btn.arrowColor, background: btn.arrowColor }}
                    className="size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
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

export default ContractButton;
