import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, ContractVehicleResponse } from "@/types";
import { useContractVehicles } from "./useContractVehicles";
import { GET_BTNS } from "@/constant";
import { Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/formatTime";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import AddContractVehicle from "./AddContractVehicle";

const ContractVehicles = () => {
  const {
    data,
    isLoading,
    setValue,
    rowSelection,
    setRowSelection,
    ConfirmDialog,
    handleActionClick,
    ConfirmDialogRemoveAll,
    openDialogAll,
    handleAddContractVehicle,
    errors,
    value,
  } = useContractVehicles();
  const { t } = useTranslation();

  const BTNS = [...GET_BTNS("delete")];

  const columnConfigs: ColumnConfig[] = [
    {
      label: t("vehicle.response.vehicleType"),
      accessorKey: "vehicleType",
      isSort: true,
      isCenter: true,
      hasBadge: true,
    },
    {
      label: t("vehicle.response.licensePlate"),
      accessorKey: "licensePlate",
      isSort: true,
      isCenter: true,
      hasHighlight: true,
    },
    {
      label: t("vehicle.response.owner"),
      accessorKey: "fullName",
      isSort: true,
      isCenter: true,
    },
    {
      label: t("vehicle.response.actions"),
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: ContractVehicleResponse) => {
        const contractVehicle = row;
        return (
          <div className="flex gap-2">
            {BTNS.map((btn, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => {
                        handleActionClick(contractVehicle);
                      }}
                    >
                      <btn.icon className="text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    className="text-white"
                    style={{ background: btn.arrowColor }}
                    arrow={false}
                  >
                    <p>{t(btn.tooltipContent)}</p>
                    <TooltipPrimitive.Arrow
                      style={{
                        fill: btn.arrowColor,
                        background: btn.arrowColor,
                      }}
                      className="size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        );
      },
    },
    {
      label: t("vehicle.response.status"),
      accessorKey: "vehicleStatus",
      isSort: true,
      isCenter: true,
      hasBadge: true,
    },
    {
      label: t("vehicle.response.registrationDate"),
      accessorKey: "registrationDate",
      isSort: true,
      isCenter: true,
      render: (row: ContractVehicleResponse) => <span>{formatDate(row.registrationDate)}</span>,
    },
    {
      label: t("contract.response.startDate"),
      accessorKey: "startDate",
      isSort: true,
      isCenter: true,
      render: (row: ContractVehicleResponse) => <span>{formatDate(row.startDate)}</span>,
    },
    {
      label: t("contract.response.endDate"),
      accessorKey: "endDate",
      isSort: true,
      isCenter: true,
      render: (row: ContractVehicleResponse) => <span>{formatDate(row.endDate)}</span>,
    },
    {
      label: t("vehicle.response.createdAt"),
      accessorKey: "createdAt",
      isSort: true,
      hasDate: true,
    },
    {
      label: t("vehicle.response.updatedAt"),
      accessorKey: "updatedAt",
      isSort: true,
      hasDate: true,
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="pb-5 rounded-t-sm bg-background rounded-b-sm">
        <div className="h-full bg-background rounded-t-sm">
          <div className="flex px-4 py-3 justify-between items-center">
            <h3 className="font-semibold">{t("contract.vehicles")}</h3>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <Modal
                    title={t("contract.addVehicle")}
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={"default"} className="cursor-pointer">
                          <Plus className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={t(Notice.ADD)}
                    onConfirm={handleAddContractVehicle}
                  >
                    <AddContractVehicle
                      errors={errors}
                      setValue={setValue}
                      value={value}
                      data={data?.data ?? []}
                    />
                  </Modal>
                  <TooltipContent
                    className="text-white"
                    style={{
                      background: "var(--color-primary)",
                    }}
                    arrow={false}
                  >
                    <p>t{"contract.addOrUpdate.titleAdd"}</p>
                    <TooltipPrimitive.Arrow
                      style={{
                        fill: "var(--color-primary)",
                        background: "var(--color-primary)",
                      }}
                      className={"size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"}
                    />
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={"delete"}
                      className="cursor-pointer"
                      onClick={() => openDialogAll(rowSelection)}
                      disabled={!Object.values(rowSelection).some(Boolean)}
                    >
                      <Trash2 className="text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    className="text-white"
                    style={{
                      background: "var(--color-red-400)",
                    }}
                    arrow={false}
                  >
                    <p>Xóa</p>
                    <TooltipPrimitive.Arrow
                      style={{
                        fill: "var(--color-red-400)",
                        background: "var(--color-red-400)",
                      }}
                      className={"size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"}
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <DataTable<ContractVehicleResponse>
          data={data?.data ?? []}
          columns={buildColumnsFromConfig(columnConfigs)}
          page={0}
          size={0}
          totalElements={data?.meta?.pagination?.total || 0}
          totalPages={data?.meta?.pagination?.totalPages || 0}
          loading={isLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          disablePagination
        />
      </div>
      <ConfirmDialog />
      <ConfirmDialogRemoveAll />
    </div>
  );
};

export default ContractVehicles;
