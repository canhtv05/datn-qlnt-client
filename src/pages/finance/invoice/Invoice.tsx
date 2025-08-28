import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, InvoiceResponse } from "@/types";
import { GET_BTNS } from "@/constant";
import { useInvoice } from "./useInvoice";
import InvoiceButton from "@/components/finance/invoice/InvoiceButton";
import InvoiceFilter from "@/components/finance/invoice/InvoiceFilter";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import UpdateInvoice from "@/components/finance/invoice/UpdateInvoice";
import StatisticCard from "@/components/StatisticCard";
import { useTranslation } from "react-i18next";
import { lang } from "@/lib/utils";

const Invoice = () => {
  const {
    props,
    data,
    isLoading,
    query,
    handleActionClick,
    rowSelection,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    handleUpdateFloor,
    value,
    setValue,
    errors,
    contractInitToAdd,
    buildingInitToAdd,
    dataInvoiceStatistics,
    // floorInitToAdd,
    ConfirmDialog,
  } = useInvoice();
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
        return (
          <div className="flex gap-2">
            {GET_BTNS("update", "delete", "status", "view").map((btn, index) => (
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
      isCenter: true,
      render(row: InvoiceResponse) {
        return <span>{new Date(row.paymentDueDate).toLocaleDateString(lang)}</span>;
      },
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
      <StatisticCard data={dataInvoiceStatistics} />
      <div className="shadow-lg">
        <InvoiceButton
          ids={rowSelection}
          contractInitToAdd={contractInitToAdd}
          buildingInitToAdd={buildingInitToAdd}
          data={data?.data ?? []}
          // floorInitToAdd={floorInitToAdd}
        />
        <InvoiceFilter props={props} type="default" />
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
        <Modal
          title={t("invoice.updateTitle")}
          trigger={null}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onConfirm={handleUpdateFloor}
          desc={t(Notice.UPDATE)}
        >
          <UpdateInvoice
            handleChange={handleChange}
            value={value}
            setValue={setValue}
            errors={errors}
          />
        </Modal>
        <ConfirmDialog />
      </div>
    </div>
  );
};

export default Invoice;
