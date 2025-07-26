import "@/assets/css/print.css";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import { ACTION_BUTTONS, GET_BTNS } from "@/constant";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import RenderIf from "@/components/RenderIf";
import Modal from "@/components/Modal";
import { Notice, ServiceCategory } from "@/enums";
import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import AddItemInvoiceDetail from "@/components/finance/invoice/AddItemInvoiceDetail";
import UpdateItemInvoiceDetail from "@/components/finance/invoice/UpdateItemInvoiceDetail";
import useInvoiceDetail from "./useInvoiceDetail";
import { ColumnConfig, InvoiceItemResponse } from "@/types";

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

  const columnConfigs: ColumnConfig[] = [
    {
      label: "Tên dịch vụ",
      accessorKey: "serviceName",
      isSort: true,
    },
    {
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
    },
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
      isSort: true,
    },
    {
      label: "Chỉ số mới",
      accessorKey: "newIndex",
      isSort: true,
    },
    {
      label: "Số lượng",
      accessorKey: "quantity",
      isSort: true,
    },
    {
      label: "Đơn vị",
      accessorKey: "unit",
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

  const CUSTOM_ACTION_BUTTONS = [...viewBtn, ...ACTION_BUTTONS];

  return (
    <div className="py-5 bg-background rounded-md flex flex-col">
      <div className="flex justify-between items-center px-5">
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
          columns={buildColumnsFromConfig(columnConfigs)}
          loading={isLoading}
          page={0}
          rowSelection={rowsSelection}
          setRowSelection={setRowsSelection}
          size={0}
          totalElements={data?.data.items.length ?? 0}
          totalPages={0}
          disablePagination
        />
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
