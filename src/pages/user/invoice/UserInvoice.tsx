import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { ColumnConfig, InvoiceResponse } from "@/types";
import { useUserInvoice } from "./useUserInvoice";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import InvoiceFilterForUser from "@/components/finance/invoice/InvoiceFilterForUser";
import { GET_BTNS } from "@/constant";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import cookieUtil from "@/utils/cookieUtil";
import { useTranslation } from "react-i18next";

const UserInvoice = () => {
  const { props, data, isLoading, query, rowSelection, setRowSelection } = useUserInvoice();
  const { page, size } = query;
  const navigate = useNavigate();
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
        return (
          <div className="flex gap-2">
            {GET_BTNS("view").map((btn, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/invoices/view/${row.id}`, { replace: true });
                        cookieUtil.setStorage({
                          paymentReceiptId: row.paymentReceiptId,
                          statusInvoice: row.invoiceStatus,
                        });
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
      hasDate: true,
    },
    {
      label: t("invoice.response.invoiceType"),
      accessorKey: "invoiceType",
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
    <div className="flex flex-col">
      <div className="rounded-t-sm bg-background">
        <h3 className="px-4 py-7 block font-semibold">{t("invoice.title")}</h3>
        <InvoiceFilterForUser props={props} />
      </div>
      <DataTable<InvoiceResponse>
        data={data?.data ?? []}
        columns={buildColumnsFromConfig(columnConfigs)}
        page={Number(page)}
        size={Number(size)}
        totalElements={data?.meta?.pagination?.total || 0}
        totalPages={data?.meta?.pagination?.totalPages || 0}
        loading={isLoading}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </div>
  );
};

export default UserInvoice;
