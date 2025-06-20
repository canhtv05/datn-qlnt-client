import { useCallback, useEffect, useState } from "react";
import StatisticCard from "@/components/StatisticCard";
import DataTable from "@/components/DataTable";
import { LucideIcon, PenTool, Plus, Trash2 } from "lucide-react";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import BuildingButton from "@/components/data-category/building/BuildingButton";
import BuildingFilter from "@/components/data-category/building/BuildingFilter";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { httpRequest } from "@/utils/httpRequest";
import { ApiResponse, BuildingResponse, ColumnConfig } from "@/types";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

interface FilterValues {
  search: string;
  status: string;
}

interface BtnType {
  tooltipContent: string;
  icon: LucideIcon;
  arrowColor: string;
  type: "update" | "delete";
  hasConfirm: boolean;
}

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

const btns: BtnType[] = [
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
  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = Number(searchParams.get("page")) || 1;
  const sizeFromUrl = Number(searchParams.get("size")) || 15;
  const buildingCode = searchParams.get("buildingCode") || "";
  const address = searchParams.get("address") || "";
  const status = searchParams.get("status") || "";

  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [perPage, setPerPage] = useState(sizeFromUrl);

  const [filterValues, setFilterValues] = useState<FilterValues>({
    search: "",
    status: "",
  });

  useEffect(() => {
    setFilterValues({
      search: buildingCode,
      status: status,
    });

    setCurrentPage(pageFromUrl);
    setPerPage(sizeFromUrl);
  }, [buildingCode, pageFromUrl, sizeFromUrl, status]);

  const handleClear = () => {
    setFilterValues({
      search: "",
      status: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.search) params.set("buildingCode", filterValues.search);
    if (filterValues.status) params.set("status", filterValues.status);
    params.set("page", "1");
    setSearchParams(params);
  }, [filterValues.search, filterValues.status, setSearchParams]);

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
  };

  const { data, isLoading } = useQuery<ApiResponse<BuildingResponse[]>>({
    queryKey: ["buildings", currentPage, perPage, buildingCode, address, status],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: currentPage.toString(),
        size: perPage.toString(),
      };

      if (buildingCode) params["buildingCode"] = buildingCode;
      if (address) params["address"] = address;
      if (status) params["status"] = status;

      const res = await httpRequest.get("/buildings", {
        params,
      });
      return res.data;
    },
  });

  return (
    <div className="flex flex-col">
      <StatisticCard data={dataBuildings} />
      <BuildingButton />
      <BuildingFilter props={props} />
      <DataTable<BuildingResponse>
        data={data?.data ?? []}
        columns={buildColumnsFromConfig(columnConfigs)}
        page={currentPage}
        size={perPage}
        totalElements={data?.meta?.pagination?.total || 0}
        totalPages={data?.meta?.pagination?.totalPages || 0}
        loading={isLoading}
      />
    </div>
  );
};

export default Building;
