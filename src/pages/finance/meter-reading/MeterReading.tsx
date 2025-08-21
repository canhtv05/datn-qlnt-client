import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, MeterReadingResponse } from "@/types";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import { GET_BTNS } from "@/constant";
import { useMeterReading } from "./useMeterReading";
import MeterReadingButton from "@/components/finance/meter-reading/MeterReadingButton";
import MeterReadingFilter from "@/components/finance/meter-reading/MeterReadingFilter";
import AddOrUpdateMeterReading from "@/components/finance/meter-reading/AddOrUpdateMeterReading";
import { formatDate } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const MeterReading = () => {
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
    ConfirmDialog,
    meterFindAll,
  } = useMeterReading();
  const { page, size } = query;
  const { t } = useTranslation();

  const columnConfigs: ColumnConfig[] = [
    {
      label: "Mã công tơ",
      accessorKey: "meterCode",
      isSort: true,
      hasHighlight: true,
    },
    {
      label: "Tên công tơ",
      accessorKey: "meterName",
      isSort: true,
    },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: MeterReadingResponse) => {
        return (
          <div className="flex gap-2">
            {GET_BTNS("update", "delete").map((btn, index) => (
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
    },
    {
      label: "Loại công tơ",
      accessorKey: "meterType",
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
      label: "Tháng",
      accessorKey: "month",
      isSort: true,
      isCenter: true,
    },
    {
      label: "Năm",
      accessorKey: "year",
      isSort: true,
      isCenter: true,
    },
    {
      label: "Ngày ghi chỉ số",
      accessorKey: "readingDate",
      isSort: true,
      render: (row: MeterReadingResponse) => {
        return <span>{formatDate(row.readingDate)}</span>;
      },
      isCenter: true,
    },
    {
      label: "Mô tả",
      accessorKey: "descriptionMeterReading",
      isSort: false,
    },
    {
      label: "Ngày tạo",
      accessorKey: "createdAt",
      hasDate: true,
      isSort: true,
    },
    {
      label: "Ngày cập nhật",
      accessorKey: "updatedAt",
      hasDate: true,
      isSort: true,
    },
    {
      label: "ID",
      accessorKey: "id",
      isHidden: true,
    },
    {
      label: "Meter ID",
      accessorKey: "meterId",
      isHidden: true,
    },
  ];

  return (
    <div className="flex flex-col">
      <MeterReadingButton ids={rowSelection} meterInitResponse={meterFindAll} data={data?.data ?? []} />
      <div className="shadow-lg">
        <MeterReadingFilter props={props} />
        <DataTable<MeterReadingResponse>
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
          title="Ghi chỉ số"
          trigger={null}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onConfirm={handleUpdateFloor}
          desc={Notice.UPDATE}
        >
          <AddOrUpdateMeterReading
            type="update"
            meterInitReading={meterFindAll}
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

export default MeterReading;
