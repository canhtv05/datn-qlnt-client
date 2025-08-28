import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, ServiceLittleResponse } from "@/types";
import { useServiceRoomDetail } from "./useServiceRoomDetail";
import { GET_BTNS } from "@/constant";
import { Trash2 } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTranslation } from "react-i18next";

const ServiceRoomDetail = () => {
  const {
    data,
    isLoading,
    rowSelection,
    setRowSelection,
    ConfirmDialog,
    handleActionClick,
    ConfirmDialogRemoveAll,
    openDialogAll,
  } = useServiceRoomDetail();
  const { t } = useTranslation();

  const columnConfigs: ColumnConfig[] = [
    { label: t("service.response.name"), accessorKey: "serviceName", isSort: true },
    {
      label: t("service.response.actions"),
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: ServiceLittleResponse) => {
        const serviceRoom = row;
        return (
          <div className="flex gap-2">
            {GET_BTNS("delete", "status").map((btn, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => {
                        handleActionClick(serviceRoom, btn.type as "delete");
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
    { label: t("service.response.price"), accessorKey: "unitPrice", isSort: true, isCenter: true },
    { label: t("service.response.unit"), accessorKey: "unit", isSort: true, isCenter: true },
    {
      label: t("service.response.status"),
      accessorKey: "serviceRoomStatus",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    { label: t("service.response.description"), accessorKey: "description", isSort: false },
  ];

  return (
    <div className="flex flex-col">
      <div className="pb-5 rounded-t-sm bg-background rounded-b-sm">
        <div className="h-full bg-background rounded-t-sm">
          <div className="flex px-4 py-3 justify-between items-center">
            <h3 className="font-semibold">{t("serviceRoom.detailTitle")}</h3>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={"delete"}
                      className="cursor-pointer"
                      onClick={() => openDialogAll(rowSelection)}
                      disabled={!Object.values(rowSelection).some(Boolean)}
                    >
                      <Trash2 className="text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    className="text-white"
                    style={{
                      background: "var(--color-red-400)",
                    }}
                    arrow={false}
                  >
                    <p>Xóa</p>
                    <TooltipPrimitive.Arrow
                      style={{
                        fill: "var(--color-red-400)",
                        background: "var(--color-red-400)",
                      }}
                      className={"size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"}
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <DataTable<ServiceLittleResponse>
          data={data?.data?.services ?? []}
          columns={buildColumnsFromConfig(columnConfigs)}
          page={0}
          size={0}
          totalElements={data?.meta?.pagination?.total || 0}
          totalPages={data?.meta?.pagination?.totalPages || 0}
          loading={isLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          disablePagination
        />
        <div className="px-5 py-2 mt-5 w-full">
          <div className="w-full">
            <h3 className="font-semibold rounded-sm p-2 bg-primary/50 text-sm text-white mb-2 pl-5 border-b-2">
              {t("roomAsset.titleRoomInfo")}
            </h3>
            <div className="px-5 flex border-primary/20 flex-col space-y-2 [&_>span]:text-sm [&_>strong]:text-sm border-b-2 border-r-2 border-l-2 -mt-3 rounded-b-sm">
              <strong className="mt-2">
                - {t("room.response.roomCode")}: <span>{data?.data?.roomCode}</span>
              </strong>
              <strong>
                - {t("room.response.roomType")}:{" "}
                <span>{data?.data?.roomType && <StatusBadge status={data?.data?.roomType} />}</span>
              </strong>
              <strong>
                - {t("room.response.status")}:{" "}
                <span>{data?.data?.status && <StatusBadge status={data?.data?.status} />}</span>
              </strong>
              <strong className="pb-2">
                - {t("room.response.description")}:{" "}
                <p className="inline-block">
                  {data?.data?.description !== "" ? (
                    data?.data?.description
                  ) : (
                    <StatusBadge status={data?.data?.description} />
                  )}
                </p>
              </strong>
            </div>
          </div>
        </div>
      </div>
      <ConfirmDialog />
      <ConfirmDialogRemoveAll />
    </div>
  );
};

export default ServiceRoomDetail;
