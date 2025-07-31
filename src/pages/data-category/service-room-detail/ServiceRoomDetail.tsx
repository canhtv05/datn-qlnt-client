import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, ServiceLittleResponse } from "@/types";
import { useServiceRoomDetail } from "./useServiceRoomDetail";
import { GET_BTNS } from "@/constant";
import { Trash2 } from "lucide-react";

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

  const columnConfigs: ColumnConfig[] = [
    { label: "Tên dịch vụ", accessorKey: "serviceName", isSort: true },
    {
      label: "Thao tác",
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
        );
      },
    },
    { label: "Đơn giá", accessorKey: "unitPrice", isSort: true, isCenter: true },
    { label: "Đơn vị", accessorKey: "unit", isSort: true, isCenter: true },
    {
      label: "Trạng thái dịch vụ phòng",
      accessorKey: "serviceRoomStatus",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    { label: "Mô tả", accessorKey: "description", isSort: false },
  ];

  return (
    <div className="flex flex-col">
      <div className="pb-5 rounded-t-sm bg-background rounded-b-sm">
        <div className="h-full bg-background rounded-t-sm mt-4">
          <div className="flex px-4 py-3 justify-between items-center">
            <h3 className="font-semibold">Chi tiết dịch vụ phòng</h3>
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
      </div>
      <ConfirmDialog />
      <ConfirmDialogRemoveAll />
    </div>
  );
};

export default ServiceRoomDetail;
