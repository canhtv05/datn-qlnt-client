import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ServiceResponse, ColumnConfig, FloorResponse } from "@/types";
import { useHistoryService } from "./useHistoryService";
import { BUTTON_HISTORY, GET_BTNS } from "@/constant";
import { Notice } from "@/enums";
import ServiceFilter from "@/components/data-category/service/ServiceFilter";
import { useTranslation } from "react-i18next";

const HistoryService = () => {
  const {
    ConfirmDialog,
    data,
    handleActionClick,
    isLoading,
    props,
    query,
    rowSelection,
    setRowSelection,
    ConfirmDialogRemoveAll,
    openDialogAll,
  } = useHistoryService();
  const { page, size } = query;
  const { t } = useTranslation();

  const columnConfigs: ColumnConfig[] = [
    {
      label: "Tên dịch vụ",
      accessorKey: "name",
      isSort: true,
    },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: ServiceResponse) => {
        const service: ServiceResponse = row;
        return (
          <div className="flex gap-2">
            {GET_BTNS("delete", "undo").map((btn, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => {
                        handleActionClick(service, btn.type);
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
    {
      label: "Loại dịch vụ",
      accessorKey: "serviceCategory",
      isSort: true,
      isCenter: true,
      hasBadge: true,
    },
    {
      label: "Đơn vị",
      accessorKey: "unit",
      isSort: false,
      isCenter: true,
    },
    {
      label: "Giá",
      accessorKey: "price",
      isSort: true,
    },
    {
      label: "Áp dụng theo",
      accessorKey: "serviceCalculation",
      isSort: true,
      isCenter: true,
      hasBadge: true,
    },
    {
      label: "Trạng thái",
      accessorKey: "status",
      isSort: true,
      isCenter: true,
      hasBadge: true,
    },
    {
      label: "Mô tả",
      accessorKey: "description",
      isSort: false,
    },
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
    <div className="flex flex-col shadow-lg rounded-md">
      <div className="pb-5 rounded-t-sm bg-background rounded-b-sm">
        <div className="h-full bg-background rounded-t-sm">
          <div className="flex px-5 py-3 justify-between items-center">
            <h3 className="font-semibold">Lịch sử xóa dịch vụ</h3>
            <div className="flex gap-2">
              {BUTTON_HISTORY.map((btn, idx) => (
                <TooltipProvider key={idx}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size={"icon"}
                        variant={btn.type}
                        className="cursor-pointer"
                        onClick={() => {
                          if (btn.type === "delete") {
                            openDialogAll(
                              { ids: rowSelection, type: "remove" },
                              {
                                desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các tầng đã chọn và không thể hoàn tác lại. Bạn có chắc chắn muốn tiếp tục?",
                                type: "warn",
                              }
                            );
                          } else if (btn.type === "undo") {
                            openDialogAll(
                              { ids: rowSelection, type: "undo" },
                              {
                                desc: Notice.RESTORES,
                                type: "default",
                              }
                            );
                          }
                        }}
                        disabled={!Object.values(rowSelection).some(Boolean)}
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
          </div>
        </div>
        <ServiceFilter props={props} type="restore" />
        <DataTable<FloorResponse>
          data={data?.data ?? []}
          columns={buildColumnsFromConfig(columnConfigs)}
          page={page}
          size={size}
          totalElements={data?.meta?.pagination?.total || 0}
          totalPages={data?.meta?.pagination?.totalPages || 0}
          loading={isLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      </div>
      <ConfirmDialog />
      <ConfirmDialogRemoveAll />
    </div>
  );
};

export default HistoryService;
