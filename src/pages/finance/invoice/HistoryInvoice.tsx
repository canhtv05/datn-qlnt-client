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
    <div className="flex flex-col shadow-lg rounded-md">
      <div className="pb-5 rounded-t-sm bg-background rounded-b-sm">
        <div className="h-full bg-background rounded-t-sm">
          <div className="flex px-5 py-3 justify-between items-center">
            <h3 className="font-semibold">Lịch sử xóa hóa đơn</h3>
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
                                desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các tầng đã chọn và không thể hoàn tác lại. Bạn có chắc chắn muốn tiếp tục?",
                                type: "warn",
                              }
                            );
                          } else if (btn.type === "undo") {
                            openDialogAll(
                              { ids: rowSelection, type: "undo" },
                              {
                                desc: Notice.RESTORES,
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
