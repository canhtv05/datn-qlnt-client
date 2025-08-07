import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, FloorResponse, RoomResponse } from "@/types";
import { useHistoryRoom } from "./useHistoryRoom";
import { BUTTON_HISTORY, formatNumberField, GET_BTNS } from "@/constant";
import { Notice } from "@/enums";
import RoomFilter from "@/components/data-category/room/RoomFilter";

const HistoryRoom = () => {
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
  } = useHistoryRoom();
  const { page, size } = query;

  const columnConfigs: ColumnConfig[] = [
    {
      label: "Mã phòng",
      accessorKey: "roomCode",
      isSort: true,
      hasHighlight: true,
    },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: RoomResponse) => {
        const room: RoomResponse = row;
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
                        handleActionClick(room, btn.type);
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
    {
      label: "Diện tích",
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
      label: "Giá",
      accessorKey: "price",
      isSort: true,
      isCenter: true,
      render: (row: RoomResponse) => (
        <span
          dangerouslySetInnerHTML={{
            __html: row.price ? formatNumberField.price(row.price) : "—",
          }}
        />
      ),
    },
    {
      label: "Số người tối đa",
      accessorKey: "maximumPeople",
      isSort: true,
      isCenter: true,
      render: (row: RoomResponse) => (
        <span
          dangerouslySetInnerHTML={{
            __html: row.maximumPeople ? formatNumberField.maximumPeople(row.maximumPeople) : "—",
          }}
        />
      ),
    },
    {
      label: "Loại phòng",
      accessorKey: "roomType",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    { label: "Mô tả", accessorKey: "description" },
    {
      label: "Trạng thái",
      accessorKey: "status",
      isSort: true,
      hasBadge: true,
      isCenter: true,
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
            <h3 className="font-semibold">Lịch sử xóa phòng</h3>
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
          </div>
        </div>
        <RoomFilter props={props} type="restore" />
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

export default HistoryRoom;
