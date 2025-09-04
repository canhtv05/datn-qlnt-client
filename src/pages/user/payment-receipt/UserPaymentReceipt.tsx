import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { ColumnConfig, PaymentReceiptResponse } from "@/types";
import { useUserPaymentReceipt } from "./useUserPaymentReceipt";
import PaymentReceiptFilter from "@/components/finance/payment-receipt/PaymentReceiptFilter";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { GET_BTNS } from "@/constant";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import cookieUtil from "@/utils/cookieUtil";
import { useTranslation } from "react-i18next";

const UserPaymentReceipt = () => {
  const { props, data, isLoading, query, rowSelection, setRowSelection } = useUserPaymentReceipt();
  const { page, size } = query;
  const navigate = useNavigate();
  const { t } = useTranslation();

  const columnConfigs: ColumnConfig[] = [
    {
      label: t("paymentReceipt.response.receiptCode"),
      accessorKey: "receiptCode",
      isSort: true,
      hasHighlight: true,
    },
    {
      label: t("paymentReceipt.response.invoiceCode"),
      accessorKey: "invoiceCode",
      isSort: true,
      hasHighlight: true,
    },
    {
      label: t("paymentReceipt.response.actions"),
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: PaymentReceiptResponse) => {
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
                        navigate(`/invoices/view/${row.invoiceId}`, { replace: true });
                        cookieUtil.setStorage({ paymentReceiptId: row.id, statusInvoice: row.paymentStatus });
                      }}
                    >
                      <btn.icon className="text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-white" style={{ background: btn.arrowColor }} arrow={false}>
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
      label: t("paymentReceipt.response.amount"),
      accessorKey: "amount",
      isSort: true,
    },
    {
      label: t("paymentReceipt.response.paymentMethod"),
      accessorKey: "paymentMethod",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: t("paymentReceipt.response.paymentStatus"),
      accessorKey: "paymentStatus",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: t("paymentReceipt.response.collectedBy"),
      accessorKey: "collectedBy",
      isSort: true,
    },
    {
      label: t("paymentReceipt.response.paymentDate"),
      accessorKey: "paymentDate",
      isSort: true,
      hasDate: true,
    },
    {
      label: t("paymentReceipt.response.note"),
      accessorKey: "note",
      isSort: false,
    },
    {
      label: t("paymentReceipt.response.createdAt"),
      accessorKey: "createdAt",
      isSort: true,
      hasDate: true,
    },
    {
      label: t("paymentReceipt.response.updatedAt"),
      accessorKey: "updatedAt",
      isSort: true,
      hasDate: true,
    },

    {
      label: t("paymentReceipt.response.id"),
      accessorKey: "id",
      isHidden: true,
    },
    {
      label: t("paymentReceipt.response.invoiceId"),
      accessorKey: "invoiceId",
      isHidden: true,
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="rounded-t-sm bg-background">
        <h3 className="px-4 py-7 block font-semibold">{t("paymentReceipt.myPaymentReceipt")}</h3>
        <PaymentReceiptFilter props={props} />
      </div>
      <DataTable<PaymentReceiptResponse>
        data={data?.data?.data ?? []}
        columns={buildColumnsFromConfig(columnConfigs)}
        page={Number(page)}
        size={Number(size)}
        totalElements={data?.data?.meta?.pagination?.total || 0}
        totalPages={data?.data?.meta?.pagination?.totalPages || 0}
        loading={isLoading}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </div>
  );
};

export default UserPaymentReceipt;
