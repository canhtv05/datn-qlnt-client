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

const UserInvoice = () => {
  const { props, data, isLoading, query, rowSelection, setRowSelection } = useUserInvoice();
  const { page, size } = query;
  const navigate = useNavigate();

  const columnConfigs: ColumnConfig[] = [
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
                  <TooltipContent className="text-white" style={{ background: btn.arrowColor }} arrow={false}>
                    <p>{btn.tooltipContent}</p>
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
      label: "Tòa nhà",
      accessorKey: "buildingName",
      isSort: true,
    },
    {
      label: "Phòng",
      accessorKey: "roomCode",
      isSort: true,
    },
    {
      label: "Khách thuê",
      accessorKey: "tenantName",
      isSort: true,
    },
    {
      label: "Tháng",
      accessorKey: "month",
      isSort: true,
    },
    {
      label: "Năm",
      accessorKey: "year",
      isSort: true,
    },
    {
      label: "Tổng tiền",
      accessorKey: "totalAmount",
      isSort: true,
    },
    {
      label: "Hạn thanh toán",
      accessorKey: "paymentDueDate",
      isSort: true,
      hasDate: true,
    },
    {
      label: "Loại hóa đơn",
      accessorKey: "invoiceType",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: "Trạng thái",
      accessorKey: "invoiceStatus",
      isSort: true,
      hasBadge: true,
      isCenter: true,
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
  ];

  return (
    <div className="flex flex-col">
      <div className="rounded-t-sm bg-background">
        <h3 className="px-4 py-7 block font-semibold">Hóa đơn của tôi</h3>
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
