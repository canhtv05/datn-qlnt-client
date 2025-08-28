import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, InvoiceResponse } from "@/types";
import { useHistoryInvoice } from "./useHistoryInvoice";
import { BUTTON_HISTORY, GET_BTNS } from "@/constant";
import { Notice } from "@/enums";
import InvoiceFilter from "@/components/finance/invoice/InvoiceFilter";
import { useTranslation } from "react-i18next";

const HistoryInvoice = () => {
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
  } = useHistoryInvoice();
  const { page, size } = query;
  const { t } = useTranslation();

  const columnConfigs: ColumnConfig[] = [
    {
      label: t("invoice.response.invoiceCode"),
      accessorKey: "invoiceCode",
      isSort: true,
      hasHighlight: true,
    },
    {
      label: t("invoice.response.actions"),
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: InvoiceResponse) => {
        const invoice: InvoiceResponse = row;
        return (
          <div className="flex gap-2">
            {GET_BTNS("delete", "undo", "view").map((btn, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => {
                        handleActionClick(invoice, btn.type);
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
      label: t("invoice.response.building"),
      accessorKey: "buildingName",
      isSort: true,
    },
    {
      label: t("invoice.response.room"),
      accessorKey: "roomCode",
      isSort: true,
    },
    {
      label: t("invoice.response.tenantName"),
      accessorKey: "tenantName",
      isSort: true,
    },
    {
      label: t("invoice.response.month"),
      accessorKey: "month",
      isSort: true,
    },
    {
      label: t("invoice.response.year"),
      accessorKey: "year",
      isSort: true,
    },
    {
      label: t("invoice.response.totalAmount"),
      accessorKey: "totalAmount",
      isSort: true,
    },
    {
      label: t("invoice.response.paymentDueDate"),
      accessorKey: "paymentDueDate",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: t("invoice.response.invoiceStatus"),
      accessorKey: "invoiceStatus",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: t("invoice.response.invoiceStatus"),
      accessorKey: "note",
      isSort: false,
    },
    {
      label: t("invoice.response.createdAt"),
      accessorKey: "createdAt",
      isSort: true,
      hasDate: true,
    },
  ];

  return (
    <div className="flex flex-col shadow-lg rounded-md">
      <div className="pb-5 rounded-t-sm bg-background rounded-b-sm">
        <div className="h-full bg-background rounded-t-sm">
          <div className="flex px-5 py-3 justify-between items-center">
            <h3 className="font-semibold">{t("invoice.titleHistory")}</h3>
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
                                desc: t("common.confirmDialog.desc"),
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
        <InvoiceFilter props={props} type="restore" />
        <DataTable<InvoiceResponse>
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

export default HistoryInvoice;
