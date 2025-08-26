import StatisticCard from "@/components/StatisticCard";
import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, FloorResponse } from "@/types";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import { useFloor } from "./useFloor";
import AddOrUpdateFloor from "@/components/data-category/floor/AddOrUpdateFloor";
import FloorButton from "@/components/data-category/floor/FloorButton";
import FloorFilter from "@/components/data-category/floor/FloorFilter";
import { GET_BTNS } from "@/constant";
import { useTranslation } from "react-i18next";

const Floor = () => {
  const {
    props,
    data,
    isLoading,
    query,
    handleActionClick,
    datFloors,
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
  } = useFloor();
  const { page, size } = query;
  const { t } = useTranslation();

  const columnConfigs: ColumnConfig[] = [
    { label: t("floor.response.nameFloor"), accessorKey: "nameFloor", isSort: true },
    {
      label: t("floor.response.actions"),
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: FloorResponse) => {
        const floor: FloorResponse = row;
        return (
          <div className="flex gap-2">
            {GET_BTNS("update", "delete", "status").map((btn, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => {
                        const type = btn.type as "update" | "delete";
                        handleActionClick(floor, type);
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
          </div>
        );
      },
    },
    { label: t("floor.response.buildingName"), accessorKey: "buildingName", isSort: true },
    {
      label: t("floor.response.maximumRoom"),
      accessorKey: "maximumRoom",
      isSort: true,
      isCenter: true,
    },
    {
      label: t("floor.response.floorType"),
      accessorKey: "floorType",
      hasBadge: true,
      isCenter: true,
      isSort: true,
    },
    { label: t("floor.response.descriptionFloor"), accessorKey: "descriptionFloor" },
    {
      label: t("floor.response.status"),
      accessorKey: "status",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: t("floor.response.createdAt"),
      accessorKey: "createdAt",
      isSort: true,
      hasDate: true,
    },
    {
      label: t("floor.response.updatedAt"),
      accessorKey: "updatedAt",
      isSort: true,
      hasDate: true,
    },
  ];

  return (
    <div className="flex flex-col">
      <StatisticCard data={datFloors} />
      <div className="shadow-lg">
        <FloorButton ids={rowSelection} data={data?.data ?? []} />
        <FloorFilter props={props} type="default" />
        <DataTable<FloorResponse>
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
          title={t("floor.title")}
          trigger={null}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onConfirm={handleUpdateFloor}
          desc={t(Notice.UPDATE)}
        >
          <AddOrUpdateFloor
            handleChange={handleChange}
            value={value}
            setValue={setValue}
            errors={errors}
            type="add"
          />
        </Modal>
        <ConfirmDialog />
      </div>
    </div>
  );
};

export default Floor;
