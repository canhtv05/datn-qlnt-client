import "@/assets/css/print.css";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import { ACTION_BUTTONS, GET_BTNS } from "@/constant";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import RenderIf from "@/components/RenderIf";
import Modal from "@/components/Modal";
import { InvoiceStatus, Notice, ServiceCategory } from "@/enums";
import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import AddItemInvoiceDetail from "@/components/finance/invoice/AddItemInvoiceDetail";
import UpdateItemInvoiceDetail from "@/components/finance/invoice/UpdateItemInvoiceDetail";
import useInvoiceDetail from "./useInvoiceDetail";
import { ColumnConfig, InvoiceItemResponse } from "@/types";
import StatusBadge from "@/components/ui/StatusBadge";
import { Info } from "lucide-react";

const InvoiceDetail = () => {
  const {
    handleChange,
    handleActionClick,
    handleAddInvoiceDetail,
    handleUpdateInvoiceItem,
    errorsCreation,
    errorsUpdate,
    setValueCreation,
    setValueUpdate,
    valueCreation,
    valueUpdate,
    dataServiceRoom,
    rowsSelection,
    setRowsSelection,
    handleButton,
    ConfirmDialogAdd,
    ConfirmDialogUpdate,
    data,
    isLoading,
    isModalOpen,
    id,
    setIsModalOpen,
    typeRef,
    navigate,
    viewBtn,
  } = useInvoiceDetail();

  const columnConfigs = (invoiceStatus: InvoiceStatus): ColumnConfig[] => {
    const actionColumn: ColumnConfig | null =
      invoiceStatus !== InvoiceStatus.DA_THANH_TOAN
        ? {
            label: "Thao tác",
            accessorKey: "actions",
            isSort: false,
            isCenter: true,
            render: (row: InvoiceItemResponse) => {
              const category = row.serviceCategory;
              const disableBtns =
                category === ServiceCategory.TIEN_PHONG ||
                (category !== ServiceCategory.DIEN &&
                  category !== ServiceCategory.NUOC &&
                  category !== ServiceCategory.DEN_BU);

              return (
                <div className="flex gap-2">
                  {!disableBtns &&
                    GET_BTNS("update", "delete").map((btn, index) => (
                      <TooltipProvider key={index}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant={btn.type}
                              className="cursor-pointer"
                              onClick={() => {
                                const type = btn.type as "update";
                                handleActionClick(row, type);
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
          }
        : null;

    return [
      {
        label: "Tên dịch vụ",
        accessorKey: "serviceName",
        isSort: true,
      },
      ...(actionColumn ? [actionColumn] : []),
      {
        label: "Loại dịch vụ",
        accessorKey: "serviceCategory",
        isSort: true,
        hasBadge: true,
        isCenter: true,
      },
      {
        label: "Cách tính",
        accessorKey: "serviceCalculation",
        isSort: true,
        hasBadge: true,
        isCenter: true,
      },
      {
        label: "Chỉ số cũ",
        accessorKey: "oldIndex",
        isCenter: true,
        isSort: true,
      },
      {
        label: "Chỉ số mới",
        accessorKey: "newIndex",
        isCenter: true,
        isSort: true,
      },
      {
        label: "Số lượng",
        accessorKey: "quantity",
        isSort: true,
        isCenter: true,
      },
      {
        label: "Đơn vị",
        accessorKey: "unit",
        isCenter: true,
        isSort: false,
      },
      {
        label: "Đơn giá",
        accessorKey: "unitPrice",
        isSort: true,
      },
      {
        label: "Thành tiền",
        accessorKey: "amount",
        isSort: true,
      },
      {
        label: "Mô tả",
        accessorKey: "description",
      },
    ];
  };

  const CUSTOM_ACTION_BUTTONS = [...viewBtn, ...ACTION_BUTTONS];

  return (
    <div className="py-5 bg-background rounded-md flex flex-col">
      <div className="flex lg:flex-row flex-col justify-between items-center px-5">
        <h3 className="font-semibold md:py-0 py-3 text-2xl md:text-[16px]">Hóa đơn chi tiết</h3>
        <div className="flex gap-2">
          {CUSTOM_ACTION_BUTTONS.filter((b) => b.type !== "upload" && b.type !== "download").map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Thêm hóa đơn chi tiết"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddInvoiceDetail}
                  >
                    <AddItemInvoiceDetail
                      errors={errorsCreation}
                      handleChange={handleChange("creation")}
                      serviceRooms={dataServiceRoom}
                      setValue={setValueCreation}
                      value={valueCreation}
                    />
                  </Modal>
                </RenderIf>
                <RenderIf value={btn.type === "delete"}>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => handleButton(btn)}
                      disabled={btn.type === "delete" && !Object.values(rowsSelection).some(Boolean)}
                    >
                      <btn.icon className="text-white" />
                    </Button>
                  </TooltipTrigger>
                </RenderIf>
                <RenderIf value={btn.type === "view"}>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => navigate(`/finance/invoice/view/${id}`, { replace: true })}
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
          <ConfirmDialogAdd />
        </div>
      </div>
      <main className="mt-10">
        <DataTable<InvoiceItemResponse>
          data={data?.data?.items ?? []}
          columns={buildColumnsFromConfig(columnConfigs(data?.data?.invoiceStatus || InvoiceStatus.CHUA_THANH_TOAN))}
          loading={isLoading}
          page={0}
          rowSelection={rowsSelection}
          setRowSelection={setRowsSelection}
          size={0}
          totalElements={data?.data.items.length ?? 0}
          totalPages={0}
          disablePagination
        />

        <div className="px-5 py-2 mt-5 w-full flex gap-2 lg:flex-row flex-col h-full items-stretch">
          {/* Thông tin khách thuê */}
          <div className="w-full flex flex-col flex-1">
            <h3 className="font-semibold rounded-sm p-2 bg-primary/50 text-sm text-white mb-2 pl-5 border-b-2">
              Thông tin khách thuê
            </h3>
            <div className="px-5 -mt-3 border-t-transparent py-3 border border-primary/20 flex-1 flex flex-col space-y-2 rounded-b-sm [&_>span]:text-sm [&_>strong]:text-sm">
              <strong>
                - Mã phòng: <span>{data?.data?.roomCode}</span>
              </strong>
              <strong>
                - Tên tòa nhà: <span>{data?.data?.buildingName}</span>
              </strong>
              <strong>
                - Khách đại diện: <span>{data?.data?.tenantName}</span>
              </strong>
              <strong>
                - Số điện thoại: <span>{data?.data?.tenantPhone}</span>
              </strong>
            </div>
          </div>

          <div className="w-full flex flex-col flex-1">
            <h3 className="font-semibold rounded-sm p-2 bg-primary/50 text-sm text-white mb-2 pl-5 border-b-2">
              Thông tin hóa đơn
            </h3>
            <div className="px-5 -mt-3 border-t-transparent py-3 border border-primary/20 flex-1 flex flex-col space-y-2 rounded-b-sm [&_>span]:text-sm [&_>strong]:text-sm">
              <strong>
                - Mã hóa đơn: <span>{data?.data?.invoiceCode}</span>
              </strong>
              <strong>
                - Loại hóa đơn:{" "}
                <span>{data?.data?.invoiceType && <StatusBadge status={data?.data?.invoiceType} />}</span>
              </strong>
              <strong>
                - Hóa đơn: <span>{`${data?.data?.month}/${data?.data?.year}`}</span>
              </strong>
              <strong>
                - Tổng tiền: <span>{`${Number(data?.data?.totalAmount || 0).toLocaleString("vi-VN")} VND`}</span>
              </strong>
              <strong>
                - Hạn thanh toán:{" "}
                <span>
                  {data?.data?.paymentDueDate
                    ? new Date(data?.data?.paymentDueDate).toLocaleDateString("vi-VN")
                    : "..."}
                </span>
              </strong>
              <strong>
                - Trạng thái:{" "}
                <span>{data?.data?.invoiceStatus && <StatusBadge status={data?.data?.invoiceStatus} />}</span>
              </strong>
            </div>
          </div>
        </div>
        <div className="mx-5 mt-2 flex lg:items-start items-center gap-2 rounded-md bg-cyan-200 px-4 py-2 shadow-sm">
          <Info className="text-cyan-800 mt-0.5 h-4 w-4" />
          <p className="text-cyan-900 text-sm font-medium">{data?.data?.note}</p>
        </div>
      </main>
      <Modal
        title="Cập nhật hóa đơn chi tiết"
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleUpdateInvoiceItem}
        desc={Notice.UPDATE}
      >
        <UpdateItemInvoiceDetail
          errors={errorsUpdate}
          handleChange={handleChange("update")}
          setValue={setValueUpdate}
          type={typeRef.current}
          value={valueUpdate}
        />
      </Modal>
      <ConfirmDialogUpdate />
    </div>
  );
};

export default InvoiceDetail;
