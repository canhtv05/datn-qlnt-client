import StatisticCard from "@/components/StatisticCard";
import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import BuildingButton from "@/components/data-category/building/BuildingButton";
import BuildingFilter from "@/components/data-category/building/BuildingFilter";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useBuilding } from "./useBuilding";
import { BuildingResponse, ColumnConfig } from "@/types";
import Modal from "@/components/Modal";
import AddOrUpdateBuilding from "@/components/data-category/building/AddOrUpdateBuilding";
import { Notice } from "@/enums";
import { GET_BTNS } from "@/constant";

const Building = () => {
  const {
    props,
    data,
    isLoading,
    query,
    handleActionClick,
    dataBuildings,
    rowSelection,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    handleUpdateBuilding,
    value,
    setValue,
    errors,
    ConfirmDialog,
  } = useBuilding();
  const { page, size } = query;

  const columnConfigs: ColumnConfig[] = [
    { label: "Mã tòa nhà", accessorKey: "buildingCode", isSort: true, hasHighlight: true },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: BuildingResponse) => {
        const building: BuildingResponse = row;
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
                        const type = btn.type as "update" | "delete" | "status";
                        handleActionClick(building, type);
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
    { label: "Tên tòa nhà", accessorKey: "buildingName", isSort: true },
    { label: "Địa chỉ", accessorKey: "address", isSort: true },
    { label: "Loại tòa nhà", accessorKey: "buildingType", isSort: true, hasBadge: true, isCenter: true },
    { label: "Số tầng thực tế", accessorKey: "actualNumberOfFloors", isSort: true, isCenter: true },
    { label: "Số tầng cho thuê", accessorKey: "numberOfFloorsForRent", isSort: true, isCenter: true },
    { label: "Mô tả", accessorKey: "description" },
    { label: "Trạng thái", accessorKey: "status", isSort: true, hasBadge: true, isCenter: true },
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
  ];

  return (
    <div className="flex flex-col">
      <StatisticCard data={dataBuildings} />
      <div className="shadow-lg">
        <BuildingButton ids={rowSelection} data={data?.data ?? []} />
        <BuildingFilter props={props} type="default" />
        <DataTable<BuildingResponse>
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
          title="Tòa nhà"
          trigger={null}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onConfirm={handleUpdateBuilding}
          desc={Notice.UPDATE}
        >
          <AddOrUpdateBuilding handleChange={handleChange} value={value} setValue={setValue} errors={errors} />
        </Modal>
        <ConfirmDialog />
      </div>
    </div>
  );
};

export default Building;
