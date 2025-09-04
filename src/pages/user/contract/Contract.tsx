import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import StatusBadge from "@/components/ui/StatusBadge";
import { GET_BTNS } from "@/constant";
import { useContract } from "./useContract";
import ContractFilter from "@/components/customer/contract/ContractFilter";
import { ContractResponse, ColumnConfig } from "@/types";
import { useTranslation } from "react-i18next";
import { formattedCurrency, lang } from "@/lib/utils";

const Contract = () => {
  const {
    query: { page, size },
    data,
    isLoading,
    props,
    handleActionClick,
  } = useContract();
  const { t } = useTranslation();

  const columnConfigs: ColumnConfig[] = [
    {
      label: t("contract.response.contractCode"),
      accessorKey: "contractCode",
      isSort: true,
      hasHighlight: true,
    },
    {
      label: t("contract.response.actions"),
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: ContractResponse) => (
        <div className="flex gap-2">
          {GET_BTNS("view").map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant={btn.type}
                    className="cursor-pointer"
                    onClick={() => handleActionClick(row)}
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
      label: t("contract.response.room"),
      accessorKey: "roomCode",
      isSort: true,
      isCenter: true,
    },
    {
      label: t("contract.response.startDate"),
      accessorKey: "startDate",
      isSort: true,
      render: (row: ContractResponse) =>
        new Date(row.startDate).toLocaleDateString(lang, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      isCenter: true,
    },
    {
      label: t("contract.response.endDate"),
      accessorKey: "endDate",
      isSort: true,
      render: (row: ContractResponse) =>
        new Date(row.endDate).toLocaleDateString(lang, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      isCenter: true,
    },
    {
      label: t("contract.response.deposit"),
      accessorKey: "deposit",
      isSort: true,
      isCenter: true,
      render: (row: ContractResponse) => `${formattedCurrency(row.deposit ?? 0)}`,
    },
    {
      label: t("contract.response.roomPrice"),
      accessorKey: "roomPrice",
      isSort: true,
      isCenter: true,
      render: (row: ContractResponse) => `${formattedCurrency(row.roomPrice ?? 0)}`,
    },
    {
      label: t("contract.response.actions"),
      accessorKey: "status",
      isSort: true,
      isCenter: true,
      hasBadge: true,
      render: (row: ContractResponse) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="shadow-lg">
        <ContractFilter props={props} type="default" />
        <DataTable<ContractResponse>
          data={data?.data ?? []}
          columns={buildColumnsFromConfig(columnConfigs, false)}
          page={Number(page)}
          size={Number(size)}
          totalElements={data?.meta?.pagination?.total || 0}
          totalPages={data?.meta?.pagination?.totalPages || 0}
          loading={isLoading}
          rowSelection={{}}
          setRowSelection={() => {}}
          disableSelect
        />
      </div>
    </div>
  );
};

export default Contract;
