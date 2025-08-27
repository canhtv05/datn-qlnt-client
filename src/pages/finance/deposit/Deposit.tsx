import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, DepositDetailView } from "@/types";
import { GET_BTNS } from "@/constant";
import { useDeposit } from "./useDeposit";
import { useTranslation } from "react-i18next";
import DepositFilter from "@/components/finance/deposit/DepositFilter";
import DepositButton from "@/components/finance/deposit/DepositButton";

const Deposit = () => {
  const {
    props,
    data,
    isLoading,
    query,
    handleActionClick,
    rowSelection,
    setRowSelection,
    ConfirmDialog,
  } = useDeposit();
  const { page, size } = query;
  const { t } = useTranslation();

  const columnConfigs: ColumnConfig[] = [
    {
      label: t("deposit.response.contractCode"),
      accessorKey: "contractCode",
      isSort: true,
      hasHighlight: true,
    },
    {
      label: t("deposit.response.actions"),
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: DepositDetailView) => {
        return (
          <div className="flex gap-2">
            {GET_BTNS("deposit1", "delete").map((btn, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => {
                        const type = btn.type as "delete" | "deposit1";
                        handleActionClick(row, type);
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
    {
      label: t("deposit.response.roomCode"),
      accessorKey: "roomCode",
      isSort: true,
    },
    {
      label: t("deposit.response.depositor"),
      accessorKey: "depositor",
      isSort: true,
      isCenter: true,
    },
    {
      label: t("deposit.response.depositRecipient"),
      accessorKey: "depositRecipient",
      isSort: true,
      isCenter: true,
    },
    {
      label: t("deposit.response.depositAmount"),
      accessorKey: "depositAmount",
      isSort: true,
      isCenter: true,
    },
    {
      label: t("deposit.response.depositStatus"),
      accessorKey: "depositStatus",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: t("deposit.response.depositDate"),
      accessorKey: "depositDate",
      isSort: true,
      hasDate: true,
    },
    {
      label: t("deposit.response.depositRefundDate"),
      accessorKey: "depositRefundDate",
      isSort: true,
      hasDate: true,
    },
    {
      label: t("deposit.response.securityDepositReturnDate"),
      accessorKey: "securityDepositReturnDate",
      isSort: true,
      hasDate: true,
    },
    {
      label: t("deposit.response.securityDepositReturnDate"),
      accessorKey: "note",
      isSort: false,
    },
    {
      label: t("deposit.response.createdAt"),
      accessorKey: "createdAt",
      isSort: true,
      hasDate: true,
    },
    {
      label: t("deposit.response.updatedAt"),
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
      label: t("deposit.response.contractId"),
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
          columns={buildColumnsFromConfig(columnConfigs)}
          page={Number(page)}
          size={Number(size)}
          totalElements={data?.meta?.pagination?.total || 0}
          totalPages={data?.meta?.pagination?.totalPages || 0}
          loading={isLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
        <ConfirmDialog />
      </div>
    </div>
  );
};

export default Deposit;
