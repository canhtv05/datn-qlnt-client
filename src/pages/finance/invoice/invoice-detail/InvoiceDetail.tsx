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
import { formattedCurrency, lang } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const InvoiceDetail = () => {
  const { t } = useTranslation();
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
            label: t("invoice.response.actions"),
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
          }
        : null;

    return [
      {
        label: t("service.response.name"),
        accessorKey: "serviceName",
        isSort: true,
      },
      ...(actionColumn ? [actionColumn] : []),
      {
        label: t("service.response.category"),
        accessorKey: "serviceCategory",
        isSort: true,
        hasBadge: true,
        isCenter: true,
      },
      {
        label: t("service.response.calculation"),
        accessorKey: "serviceCalculation",
        isSort: true,
        hasBadge: true,
        isCenter: true,
      },
      {
        label: t("meterReading.response.oldIndex"),
        accessorKey: "oldIndex",
        isCenter: true,
        isSort: true,
      },
      {
        label: t("meterReading.response.newIndex"),
        accessorKey: "newIndex",
        isCenter: true,
        isSort: true,
      },
      {
        label: t("meterReading.response.quantity"),
        accessorKey: "quantity",
        isSort: true,
        isCenter: true,
      },
      {
        label: t("service.response.unit"),
        accessorKey: "unit",
        isCenter: true,
        isSort: false,
      },
      {
        label: t("service.response.price"),
        accessorKey: "unitPrice",
        isSort: true,
      },
      {
        label: t("invoice.response.totalAmount"),
        accessorKey: "amount",
        isSort: true,
      },
      {
        label: t("service.response.description"),
        accessorKey: "description",
      },
    ];
  };

  const CUSTOM_ACTION_BUTTONS = [...viewBtn, ...ACTION_BUTTONS];

  return (
    <div className="py-5 bg-background rounded-md flex flex-col shadow-lg">
      <div className="flex lg:flex-row flex-col justify-between items-center px-5">
        <h3 className="font-semibold md:py-0 py-3 text-2xl md:text-[16px]"> {t("invoice.detail.title")}</h3>
        <div className="flex gap-2">
          {CUSTOM_ACTION_BUTTONS.filter((b) => b.type !== "upload" && b.type !== "download").map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title={t("invoice.detail.addTitle")}
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={t(Notice.ADD)}
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

        <div className="px-5 py-2 mt-5 w-full flex gap-5 lg:flex-row flex-col h-full items-stretch">
          {/* Thông tin khách thuê */}
          <div className="w-full flex flex-col flex-1">
            <h3 className="font-semibold rounded-sm p-2 bg-primary/50 text-sm text-white mb-2 pl-5 border-b-2">
              {t("invoice.detail.tenantInfo")}
            </h3>
            <div className="px-5 -mt-3 border-t-transparent py-3 border border-primary/20 flex-1 flex flex-col space-y-2 rounded-b-sm [&_>span]:text-sm [&_>strong]:text-sm">
              <strong>
                - {t("invoice.detail.roomCode")}: <span>{data?.data?.roomCode}</span>
              </strong>
              <strong>
                - {t("invoice.detail.buildingName")}: <span>{data?.data?.buildingName}</span>
              </strong>
              <strong>
                - {t("invoice.detail.tenantName")}: <span>{data?.data?.tenantName}</span>
              </strong>
              <strong>
                - {t("invoice.detail.tenantPhone")}: <span>{data?.data?.tenantPhone}</span>
              </strong>
            </div>
          </div>

          <div className="w-full flex flex-col flex-1">
            <h3 className="font-semibold rounded-sm p-2 bg-primary/50 text-sm text-white mb-2 pl-5 border-b-2">
              {t("invoice.detail.invoiceInfo")}
            </h3>
            <div className="px-5 -mt-3 border-t-transparent py-3 border border-primary/20 flex-1 flex flex-col space-y-2 rounded-b-sm [&_>span]:text-sm [&_>strong]:text-sm">
              <strong>
                - {t("invoice.detail.invoiceInfo")}: <span>{data?.data?.invoiceCode}</span>
              </strong>
              <strong>
                - {t("invoice.detail.invoiceCode")}: <span>{data?.data?.invoiceCode}</span>
              </strong>
              <strong>
                - {t("invoice.detail.invoiceType")}:{" "}
                <span>{data?.data?.invoiceType && <StatusBadge status={data?.data?.invoiceType} />}</span>
              </strong>
              <strong>
                - {t("invoice.detail.period")}: <span>{`${data?.data?.month}/${data?.data?.year}`}</span>
              </strong>
              <strong>
                - {t("invoice.detail.totalAmount")}: <span>{formattedCurrency(data?.data.totalAmount || 0)}</span>
              </strong>

              <strong>
                - {t("invoice.detail.paymentDueDate")}:{" "}
                <span>
                  {data?.data?.paymentDueDate ? new Date(data?.data?.paymentDueDate).toLocaleDateString(lang) : "..."}
                </span>
              </strong>
              <strong>
                - {t("invoice.detail.invoiceStatus")}:{" "}
                <span>{data?.data?.invoiceStatus && <StatusBadge status={data?.data?.invoiceStatus} />}</span>
              </strong>
            </div>
          </div>
        </div>
        <div className="mx-5 mt-3 flex lg:items-start items-center gap-2 rounded-md bg-cyan-200 px-4 py-2 shadow-sm">
          <Info className="text-cyan-800 mt-0.5 h-4 w-4" />
          <p className="text-cyan-900 text-sm font-medium">{data?.data?.note}</p>
        </div>
      </main>
      <Modal
        title={t("invoice.detail.updateTitle")}
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleUpdateInvoiceItem}
        desc={t(Notice.UPDATE)}
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
