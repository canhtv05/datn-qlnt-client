import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, DepositDetailView, IBtnType } from "@/types";
import { useDeposit } from "./useDeposit";
import { useTranslation } from "react-i18next";
import DepositFilter from "@/components/finance/deposit/DepositFilter";
import DepositButton from "@/components/finance/deposit/DepositButton";
import { AlertCircle, CheckCircle } from "lucide-react";

const btns: IBtnType[] = [
  {
    tooltipContent: "common.button.deposit3",
    icon: CheckCircle,
    arrowColor: "var(--color-purple-300)",
    type: "deposit2",
    hasConfirm: true,
  },
  {
    tooltipContent: "common.button.deposit2",
    icon: AlertCircle,
    arrowColor: "var(--color-indigo-500)",
    type: "deposit3",
    hasConfirm: true,
  },
];

const Deposit = () => {
  const { props, data, isLoading, query, handleActionClick, rowSelection, setRowSelection, ConfirmDialog } =
    useDeposit();
  const { page, size } = query;
  const { t } = useTranslation();

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
      render: (row: DepositDetailView) => {
        return (
          <div className="flex gap-2">
            {btns.map((btn, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => {
                        const type = btn.type as "deposit3" | "deposit2";
                        handleActionClick(row, type);
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
    {
      label: "Mã phòng",
      accessorKey: "roomCode",
      isSort: true,
    },
    {
      label: "Người đặt cọc",
      accessorKey: "depositor",
      isSort: true,
      isCenter: true,
    },
    {
      label: "Người nhận cọc",
      accessorKey: "depositRecipient",
      isSort: true,
      isCenter: true,
    },
    {
      label: "Số tiền cọc",
      accessorKey: "depositAmount",
      isSort: true,
      isCenter: true,
    },
    {
      label: "Trạng thái cọc",
      accessorKey: "depositStatus",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: "Ngày đặt cọc",
      accessorKey: "depositDate",
      isSort: true,
      hasDate: true,
    },
    {
      label: "Ngày hoàn trả",
      accessorKey: "depositRefundDate",
      isSort: true,
      hasDate: true,
    },
    {
      label: "Ngày trả lại tiền đặt cọc",
      accessorKey: "securityDepositReturnDate",
      isSort: true,
      hasDate: true,
    },
    {
      label: "Ghi chú",
      accessorKey: "note",
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
    // Các trường ẩn
    {
      label: "ID",
      accessorKey: "id",
      isHidden: true,
    },
    {
      label: "contractId",
      accessorKey: "contractId",
      isHidden: true,
    },
  ];

  return (
    <div className="flex flex-col">
      <DepositButton ids={rowSelection} />
      <div className="shadow-lg">
        <DepositFilter props={props} />
        <DataTable<DepositDetailView>
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

export default Deposit;
