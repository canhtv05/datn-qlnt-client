import { useQuery } from "@tanstack/react-query";
import { httpRequest } from "@/utils/httpRequest";
import { ApiResponse, ColumnConfig, RoomResponse } from "@/types";
import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { useState } from "react";
import { formatNumberField, GET_BTNS } from "@/constant";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

const UserRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rowSelection, setRowSelection] = useState({});
  const { data, isLoading } = useQuery<ApiResponse<RoomResponse[]>>({
    queryKey: ["room-by-tenant"],
    queryFn: async () => {
      const res = await httpRequest.get("/rooms/by-tenant");
      return res.data;
    },
    retry: 1,
  });

  const columnConfigs: ColumnConfig[] = [
    {
      label: "Mã phòng",
      accessorKey: "roomCode",
      isSort: true,
      hasHighlight: true,
      isCenter: true,
      render: (row) => row.roomCode ?? "__EMPTY__",
    },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isCenter: true,
      render: (row: RoomResponse) => (
        <div className="flex gap-2 justify-center">
          {GET_BTNS("view").map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant={btn.type}
                    className="cursor-pointer"
                    onClick={() => navigate(`/room/members/${row.id}`, { state: { background: location } })}
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
      ),
    },
    {
      label: "Tên tầng",
      accessorKey: "nameFloor",
      isSort: true,
      render: (row) => row.floor?.nameFloor ?? "__EMPTY__",
      isCenter: true,
      hasHighlight: true,
    },
    {
      label: "Tên tòa nhà",
      accessorKey: "buildingName",
      isSort: true,
      render: (row) => row.floor?.buildingName ?? "__EMPTY__",
      isCenter: true,
      hasHighlight: true,
    },
    {
      label: "Loại phòng",
      accessorKey: "roomType",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: "Trạng thái",
      accessorKey: "status",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: "Số người tối đa",
      accessorKey: "maximumPeople",
      isSort: true,
      isCenter: true,
    },
    {
      label: "Diện tích m³",
      accessorKey: "acreage",
      isSort: true,
      isCenter: true,
      render: (row: RoomResponse) => (
        <span
          dangerouslySetInnerHTML={{
            __html: row.acreage ? formatNumberField.acreage(row.acreage) : "—",
          }}
        />
      ),
    },
    {
      label: "Giá phòng",
      accessorKey: "price",
      isSort: true,
    },
  ];

  return (
    <div className="py-5 bg-background rounded-sm">
      <div className="h-full bg-background rounded-t-sm">
        <div className="flex px-4 py-3 justify-between items-center">
          <h3 className="font-semibold">Phòng của tôi</h3>
        </div>
      </div>
      <DataTable<RoomResponse>
        data={data?.data ?? []}
        columns={buildColumnsFromConfig(columnConfigs, false)}
        page={0}
        size={0}
        totalPages={0}
        totalElements={data?.data.length || 0}
        loading={isLoading}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        disablePagination
        disableSelect
      />
    </div>
  );
};

export default UserRoom;
