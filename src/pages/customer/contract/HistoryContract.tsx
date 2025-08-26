import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, ContractResponse } from "@/types";
import { useHistoryContract } from "./useHistoryContract";
import { BUTTON_HISTORY, GET_BTNS } from "@/constant";
import { Notice } from "@/enums";
import StatusBadge from "@/components/ui/StatusBadge";
import ContractFilter from "@/components/customer/contract/ContractFilter";
import { useTranslation } from "react-i18next";

const HistoryContract = () => {
  const {
    ConfirmDialog,
    data,
    handleActionClick,
    isLoading,
    props,
    query,
    rowSelection,
    setRowSelection,
    ConfirmDialogRemoveAll,
    openDialogAll,
  } = useHistoryContract();
  const { page, size } = query;
  const { t } = useTranslation();

  const columnConfigs: ColumnConfig[] = [
    {
      label: t("contract.response.contractCode"),
      accessorKey: "contractCode",
      isSort: true,
      hasHighlight: true,
    },
    {
      label: t("contract.response.actions"),
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: ContractResponse) => {
        const service: ContractResponse = row;
        return (
          <div className="flex gap-2">
            {GET_BTNS("delete", "undo").map((btn, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => {
                        handleActionClick(service, btn.type);
                      }}
                    >
                      <btn.icon className="text-white" />
                    </Button>
                  </TooltipTrigger>
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
        );
      },
    },
    {
      label: t("contract.response.room"),
      accessorKey: "roomCode",
      isSort: true,
      isCenter: true,
    },
    {
      label: t("contract.response.startDate"),
      accessorKey: "startDate",
      isSort: true,
      render: (row: ContractResponse) =>
        new Date(row.startDate).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      label: t("contract.response.endDate"),
      accessorKey: "endDate",
      isSort: true,
      render: (row: ContractResponse) =>
        new Date(row.endDate).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      label: t("contract.response.deposit"),
      accessorKey: "deposit",
      isSort: true,
      isCenter: true,
      render: (row: ContractResponse) => `${row.deposit?.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      label: t("contract.response.roomPrice"),
      accessorKey: "roomPrice",
      isSort: true,
      isCenter: true,
      render: (row: ContractResponse) => `${row.roomPrice?.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      label: t("contract.response.actions"),
      accessorKey: "status",
      isSort: true,
      isCenter: true,
      hasBadge: true,
      render: (row: ContractResponse) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="flex flex-col shadow-lg rounded-md">
      <div className="pb-5 rounded-t-sm bg-background rounded-b-sm">
        <div className="h-full bg-background rounded-t-sm">
          <div className="flex px-5 py-3 justify-between items-center">
            <h3 className="font-semibold">{t("contract.titleHistory")}</h3>
            <div className="flex gap-2">
              {BUTTON_HISTORY.map((btn, idx) => (
                <TooltipProvider key={idx}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size={"icon"}
                        variant={btn.type}
                        className="cursor-pointer"
                        onClick={() => {
                          if (btn.type === "delete") {
                            openDialogAll(
                              { ids: rowSelection, type: "remove" },
                              {
                                desc: t("common.confirmDialog.delete"),
                                type: "warn",
                              }
                            );
                          } else if (btn.type === "undo") {
                            openDialogAll(
                              { ids: rowSelection, type: "undo" },
                              {
                                desc: t(Notice.RESTORES),
                                type: "default",
                              }
                            );
                          }
                        }}
                        disabled={!Object.values(rowSelection).some(Boolean)}
                      >
                        <btn.icon className="text-white" />
                      </Button>
                    </TooltipTrigger>
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
                        className={
                          "size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
                        }
                      />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </div>
        <ContractFilter props={props} type="restore" />
        <DataTable<ContractResponse>
          data={data?.data ?? []}
          columns={buildColumnsFromConfig(columnConfigs)}
          page={page}
          size={size}
          totalElements={data?.meta?.pagination?.total || 0}
          totalPages={data?.meta?.pagination?.totalPages || 0}
          loading={isLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>
      <ConfirmDialog />
      <ConfirmDialogRemoveAll />
    </div>
  );
};

export default HistoryContract;
