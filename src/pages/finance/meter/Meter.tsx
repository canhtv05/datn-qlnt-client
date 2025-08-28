import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, MeterResponse } from "@/types";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import { GET_BTNS } from "@/constant";
import { useMeter } from "./useMeter";
import MeterButton from "@/components/finance/meter/MeterButton";
import MeterFilter from "@/components/finance/meter/MeterFilter";
import AddOrUpdateMeter from "@/components/finance/meter/AddOrUpdateMeter";
import { useTranslation } from "react-i18next";

const Meter = () => {
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
    meterInit,
    ConfirmDialog,
  } = useMeter();
  const { page, size } = query;
  const { t } = useTranslation();

  const columnConfigs: ColumnConfig[] = [
    {
      label: t("meter.response.meterCode"),
      accessorKey: "meterCode",

      isSort: true,
      hasHighlight: true,
    },
    {
      label: t("meter.response.meterName"),
      accessorKey: "meterName",
      isSort: true,
    },
    {
      label: t("meter.response.actions"),

      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: MeterResponse) => {
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
      label: t("meter.response.serviceName"),
      accessorKey: "serviceName",
      isSort: true,
    },
    {
      label: t("meter.response.meterType"),
      accessorKey: "meterType",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: t("meter.response.closestIndex"),

      accessorKey: "closestIndex",
      isSort: true,
      isCenter: true,
    },
    {
      label: t("meter.response.roomCode"),
      accessorKey: "roomCode",
      isSort: true,
    },
    {
      label: t("meter.response.descriptionMeter"),
      accessorKey: "descriptionMeter",
      isSort: false,
    },
    {
      label: t("meter.response.manufactureDate"),
      accessorKey: "manufactureDate",
      isSort: true,
      hasDate: true,
    },
    {
      label: t("meter.response.createdAt"),
      accessorKey: "createdAt",
      isSort: true,
      hasDate: true,
    },
    {
      label: t("meter.response.updatedAt"),
      accessorKey: "updatedAt",
      isSort: true,
      hasDate: true,
    },
    // Các trường ẩn
    {
      label: "meter.roomId",
      accessorKey: "roomId",
      isHidden: true,
    },
    {
      label: "meter.serviceId",
      accessorKey: "serviceId",
      isHidden: true,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* <StatisticCard data={dataDefaultServices} /> */}
      <MeterButton ids={rowSelection} meterInit={meterInit} data={data?.data} />
      <div className="shadow-lg">
        <MeterFilter props={props} />
        <DataTable<MeterResponse>
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
        <Modal
          title="meter.title"
          trigger={null}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onConfirm={handleUpdateFloor}
          desc={t(Notice.UPDATE)}
        >
          <AddOrUpdateMeter
            meterInit={meterInit}
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

export default Meter;
