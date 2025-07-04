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

  const columnConfigs: ColumnConfig[] = [
    { label: "Tên tầng", accessorKey: "nameFloor", isSort: true },
    {
      label: "Thao tác",
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
    { label: "Số phòng tối đa", accessorKey: "maximumRoom", isSort: true, isCenter: true },
    { label: "Loại tầng", accessorKey: "floorType", hasBadge: true, isCenter: true, isSort: true },
    { label: "Mô tả", accessorKey: "descriptionFloor" },
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
      <StatisticCard data={datFloors} />
      <FloorButton ids={rowSelection} />
      <FloorFilter props={props} />
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
        title="Tầng"
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleUpdateFloor}
        desc={Notice.UPDATE}
      >
        <AddOrUpdateFloor handleChange={handleChange} value={value} setValue={setValue} errors={errors} type="add" />
      </Modal>
      <ConfirmDialog />
    </div>
  );
};

export default Floor;
