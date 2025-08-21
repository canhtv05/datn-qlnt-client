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
      label: "Mã biên nhận",
      accessorKey: "receiptCode",
      isSort: true,
      hasHighlight: true,
    },
    {
      label: "Mã hóa đơn",
      accessorKey: "invoiceCode",
      isSort: true,
      hasHighlight: true,
    },
    {
      label: "Thao tác",
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
      label: "Số tiền",
      accessorKey: "amount",
      isSort: true,
    },
    {
      label: "Phương thức thanh toán",
      accessorKey: "paymentMethod",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: "Trạng thái thanh toán",
      accessorKey: "paymentStatus",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: "Người thu",
      accessorKey: "collectedBy",
      isSort: true,
    },
    {
      label: "Ngày thanh toán",
      accessorKey: "paymentDate",
      isSort: true,
      hasDate: true,
    },
    {
      label: "Ghi chú",
      accessorKey: "note",
      isSort: false,
    },
    {
      label: "Ngày tạo",
      accessorKey: "createdAt",
      isSort: true,
      hasDate: true,
    },
    {
      label: "Ngày cập nhật",
      accessorKey: "updatedAt",
      isSort: true,
      hasDate: true,
    },

    {
      label: "ID",
      accessorKey: "id",
      isHidden: true,
    },
    {
      label: "Invoice ID",
      accessorKey: "invoiceId",
      isHidden: true,
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="rounded-t-sm bg-background">
        <h3 className="px-4 py-7 block font-semibold">Phiếu thanh toán của tôi</h3>
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
