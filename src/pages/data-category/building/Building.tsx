import StatisticCard from "@/components/StatisticCard";
import DataTable from "@/components/DataTable";
import { PenTool, Plus, Trash2 } from "lucide-react";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import BuildingButton from "@/components/data-category/building/BuildingButton";
import BuildingFilter from "@/components/data-category/building/BuildingFilter";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useBuilding } from "./useBuilding";
import { BuildingResponse, ColumnConfig, IBtnType } from "@/types";

const dataBuildings = [
  {
    icon: PenTool,
    label: "Tòa nhà",
    value: 20,
  },
  {
    icon: PenTool,
    label: "Hoạt động",
    value: 9,
  },
  {
    icon: PenTool,
    label: "Không hoạt động",
    value: 3,
  },
];

const btns: IBtnType[] = [
  {
    tooltipContent: "Chỉnh sửa",
    icon: Plus,
    arrowColor: "#44475A",
    type: "update",
    hasConfirm: true,
  },
  {
    tooltipContent: "Xóa",
    icon: Trash2,
    arrowColor: "var(--color-red-400)",
    type: "delete",
    hasConfirm: true,
  },
];

const columnConfigs: ColumnConfig[] = [
  { label: "Mã tòa nhà", accessorKey: "buildingCode", isSort: true, hasHighlight: true },
  {
    label: "Thao tác",
    accessorKey: "actions",
    isSort: false,
    render: () => (
      <div className="flex gap-2">
        {btns.map((btn, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size={"icon"} variant={btn.type} className="cursor-pointer">
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
    ),
  },
  { label: "Tên tòa nhà", accessorKey: "buildingName", isSort: true },
  { label: "Địa chỉ", accessorKey: "address", isSort: true },
  { label: "Loại tòa nhà", accessorKey: "buildingType", isSort: true, hasBadge: true, isCenter: true },
  { label: "Mô tả", accessorKey: "description" },
  { label: "Trạng thái", accessorKey: "status", isSort: true, hasBadge: true, isCenter: true },
];

const Building = () => {
  const { props, data, isLoading, query } = useBuilding();
  const { page, size } = query;

  return (
    <div className="flex flex-col">
      <StatisticCard data={dataBuildings} />
      <BuildingButton />
      <BuildingFilter props={props} />
      <DataTable<BuildingResponse>
        data={data?.data ?? []}
        columns={buildColumnsFromConfig(columnConfigs)}
        page={Number(page)}
        size={Number(size)}
        totalElements={data?.meta?.pagination?.total || 0}
        totalPages={data?.meta?.pagination?.totalPages || 0}
        loading={isLoading}
      />
    </div>
  );
};

export default Building;
