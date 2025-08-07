import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, ContractResponse } from "@/types";
import { useHistoryContract } from "./useHistoryContract";
import { BUTTON_HISTORY, GET_BTNS } from "@/constant";
import { Notice } from "@/enums";
import StatusBadge from "@/components/ui/StatusBadge";
import ContractFilter from "@/components/customer/contract/ContractFilter";

const HistoryContract = () => {
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
  } = useHistoryContract();
  const { page, size } = query;

  const columnConfigs: ColumnConfig[] = [
    {
      label: "Mã hợp đồng",
      accessorKey: "contractCode",
      isSort: true,
      hasHighlight: true,
    },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: ContractResponse) => {
        const service: ContractResponse = row;
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
      label: "Phòng",
      accessorKey: "roomCode",
      isSort: true,
      isCenter: true,
    },
    {
      label: "Khách thuê",
      accessorKey: "tenants",
      render: (row: ContractResponse) => row.tenants?.map((t) => t.fullName).join(", ") || "—",
    },
    {
      label: "Số người",
      accessorKey: "numberOfPeople",
      isSort: true,
      isCenter: true,
      render: (row: ContractResponse) => `${row.numberOfPeople} người/phòng`,
    },
    {
      label: "Ngày bắt đầu",
      accessorKey: "startDate",
      isSort: true,
      render: (row: ContractResponse) =>
        new Date(row.startDate).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      label: "Ngày kết thúc",
      accessorKey: "endDate",
      isSort: true,
      render: (row: ContractResponse) =>
        new Date(row.endDate).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      label: "Tiền cọc",
      accessorKey: "deposit",
      isSort: true,
      isCenter: true,
      render: (row: ContractResponse) => `${row.deposit?.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      label: "Tiền phòng",
      accessorKey: "roomPrice",
      isSort: true,
      isCenter: true,
      render: (row: ContractResponse) => `${row.roomPrice?.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      label: "Trạng thái",
      accessorKey: "status",
      isSort: true,
      isCenter: true,
      hasBadge: true,
      render: (row: ContractResponse) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="flex flex-col shadow-lg rounded-md">
      <div className="pb-5 rounded-t-sm bg-background rounded-b-sm">
        <div className="h-full bg-background rounded-t-sm">
          <div className="flex px-5 py-3 justify-between items-center">
            <h3 className="font-semibold">Lịch sử xóa hợp đồng</h3>
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
        <ContractFilter props={props} type="restore" />
        <DataTable<ContractResponse>
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

export default HistoryContract;
