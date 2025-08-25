import { useRoomAssetAll } from "./useRoomAssetAll";
import StatisticCard from "@/components/StatisticCard";
import DataTable from "@/components/DataTable";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, RoomAssetAllResponse } from "@/types";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { GET_BTNS } from "@/constant";
import RoomAssetFilter from "@/components/data-category/room-assets/RoomAssetFilter";
import { useNavigate, useParams } from "react-router-dom";
import RoomAssetButton from "@/components/data-category/room-assets/RoomAssetButton";
import { useTranslation } from "react-i18next";

const RoomAsset = () => {
  const {
    data,
    isLoading,
    statistics,
    ConfirmDialog,
    query,
    rowSelection,
    setRowSelection,
    props,
  } = useRoomAssetAll();
  const navigate = useNavigate();

  const { id } = useParams();

  const { page, size } = query;
  const { t } = useTranslation();
  const columnConfigs: ColumnConfig[] = [
    {
      label: t("room.response.roomCode"),
      accessorKey: "roomCode",
      isSort: true,
      hasHighlight: true,
      isCenter: true,
    },
    {
      label: t("roomAsset.response.actions"),
      accessorKey: "actions",
      isCenter: true,
      render: (row: RoomAssetAllResponse) => (
        <div className="flex gap-2 justify-center">
          {GET_BTNS("view").map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant={btn.type}
                    className="cursor-pointer"
                    onClick={() => {
                      navigate(`/asset-management/room-assets/detail/${row.id}?buildingId=${id}`, {
                        replace: true,
                      });
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
      ),
    },
    {
      label: t("asset.totalAssets"),
      accessorKey: "totalAssets",
      isSort: true,
      isCenter: true,
    },
    {
      label: t("room.response.roomType"),
      accessorKey: "roomType",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: t("roomAsset.response.status"),
      accessorKey: "status",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    { label: t("roomAsset.response.description"), accessorKey: "description" },
  ];

  const { roomId } = useParams();

  return (
    <div className="flex flex-col">
      <StatisticCard data={statistics} />
      <div className="shadow-lg">
        <RoomAssetButton
          ids={rowSelection}
          roomId={roomId ?? ""}
          type="default"
          buildingOptions={[]}
          data={data?.data}
        />
        <RoomAssetFilter props={props} />
        <DataTable<RoomAssetAllResponse>
          data={data?.data ?? []}
          columns={buildColumnsFromConfig(columnConfigs, false)}
          page={Number(page)}
          size={Number(size)}
          totalElements={data?.meta?.pagination?.total || 0}
          totalPages={data?.meta?.pagination?.totalPages || 0}
          loading={isLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          disableSelect
        />
        <ConfirmDialog />
      </div>
    </div>
  );
};

export default RoomAsset;
