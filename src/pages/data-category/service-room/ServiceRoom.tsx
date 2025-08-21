import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, ServiceRoomResponse, ServiceRoomView } from "@/types";
import { useServiceRoom } from "./useServiceRoom";
import { GET_BTNS } from "@/constant";
import ServiceRoomButton from "@/components/data-category/service-room/ServiceRoomButton";
import ServiceRoomFilter from "@/components/data-category/service-room/ServiceRoomFilter";
import StatisticCard from "@/components/StatisticCard";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ServiceRoom = () => {
  const {
    props,
    data,
    isLoading,
    query,
    rowSelection,
    setRowSelection,
    dataServices,
    roomOptions,
    serviceOptions,
    buildingOptions,
  } = useServiceRoom();
  const { page, size } = query;
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const columnConfigs: ColumnConfig[] = [
    { label: "Mã phòng", accessorKey: "roomCode", isSort: true, isCenter: true, hasHighlight: true },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: ServiceRoomResponse) => {
        return (
          <div className="flex gap-2">
            {GET_BTNS("view").map((btn, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => {
                        navigate(`/service-management/room-services/detail/${row.id}?buildingId=${id}`, {
                          replace: true,
                        });
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
    { label: "Tổng dịch vụ", accessorKey: "totalServices", isSort: true, isCenter: true },
    { label: "Loại phòng", accessorKey: "roomType", isSort: true, isCenter: true, hasBadge: true },
    { label: "Trạng thái", accessorKey: "status", isSort: true, hasBadge: true, isCenter: true },
    { label: "Mô tả", accessorKey: "descriptionServiceRoom", isSort: false },
  ];

  return (
    <div className="flex flex-col">
      <StatisticCard data={dataServices} />
      <div className="shadow-lg">
        <ServiceRoomButton
          ids={rowSelection}
          roomOptions={roomOptions}
          serviceOptions={serviceOptions}
          buildingOptions={buildingOptions}
          data={data?.data ?? []}
        />
        <ServiceRoomFilter props={props} />
        <DataTable<ServiceRoomView>
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
      </div>
    </div>
  );
};

export default ServiceRoom;
