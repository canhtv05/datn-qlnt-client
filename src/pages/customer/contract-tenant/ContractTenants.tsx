import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, ContractTenantDetailResponse, IBtnType } from "@/types";
import { useContractTenant } from "./useContractTenant";
import { GET_BTNS } from "@/constant";
import { ArrowRightLeft, Plus, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { formatDate } from "@/utils/formatTime";
import RenderIf from "@/components/RenderIf";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import AddContractTenant from "./AddContractTenant";
import ContractTenantFilter from "./ContractTenantFilter";

const ContractTenants = () => {
  const {
    data,
    isLoading,
    setValue,
    rowSelection,
    setRowSelection,
    ConfirmDialog,
    handleActionClick,
    ConfirmDialogRemoveAll,
    openDialogAll,
    handleAddContractTenant,
    query: { page, size },
    errors,
    props,
    value,
  } = useContractTenant();
  const { t } = useTranslation();

  const changeBtn: IBtnType[] = [
    {
      tooltipContent: t("contract.changeRepresentative"),

      icon: ArrowRightLeft,
      arrowColor: "var(--color-sky-500)",
      type: "status",
      hasConfirm: true,
    },
  ];

  const BTNS = [...GET_BTNS("delete"), ...changeBtn];

  const columnConfigs: ColumnConfig[] = [
    {
      label: t("asset.response.tenantId"),
      accessorKey: "customerCode",
      isSort: true,
      isCenter: true,
      hasHighlight: true,
    },
    Array.isArray(data?.data) && data.data.length > 1
      ? {
          label: t("contract.response.actions"),
          accessorKey: "actions",
          isSort: false,
          isCenter: true,
          render: (row: ContractTenantDetailResponse) => {
            const contractTenant = row;
            return (
              <div className="flex gap-2">
                {BTNS.map((btn, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant={btn.type}
                          className="cursor-pointer"
                          onClick={() => {
                            handleActionClick(contractTenant, btn.type as "delete" | "status");
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
        }
      : undefined,
    { label: t("tenant.response.fullName"), accessorKey: "fullName", isSort: true, isCenter: true },
    {
      label: t("tenant.response.gender"),
      accessorKey: "gender",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: t("tenant.response.phoneNumber"),
      accessorKey: "phoneNumber",
      isSort: true,
      isCenter: true,
    },
    { label: "Email", accessorKey: "email", isSort: true, isCenter: true },
    {
      label: t("contract.contract.nameUser"),
      accessorKey: "representative",
      hasBadge: true,
      isSort: true,
      isCenter: true,
    },
    {
      label: t("contract.contract.startDate"),
      accessorKey: "startDate",
      isSort: true,
      isCenter: true,
      render: (row: ContractTenantDetailResponse) => {
        return <span>{formatDate(row.startDate)}</span>;
      },
    },
    {
      label: t("contract.contract.endDate"),
      accessorKey: "endDate",
      isSort: true,
      isCenter: true,
      render: (row: ContractTenantDetailResponse) => {
        return <span>{formatDate(row.endDate)}</span>;
      },
    },
  ].filter(Boolean) as ColumnConfig[];

  return (
    <div className="flex flex-col">
      <div className="pb-5 rounded-t-sm bg-background rounded-b-sm">
        <div className="h-full bg-background rounded-t-sm">
          <div className="flex px-4 py-3 justify-between items-center">
            <h3 className="font-semibold">{t("contract.title")}</h3>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <Modal
                    title={t("contract.addTenant")}
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={"default"} className="cursor-pointer">
                          <Plus className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={t(Notice.ADD)}
                    onConfirm={handleAddContractTenant}
                  >
                    <AddContractTenant
                      errors={errors}
                      setValue={setValue}
                      value={value}
                      data={data?.data ?? []}
                    />
                  </Modal>
                  <TooltipContent
                    className="text-white"
                    style={{
                      background: "var(--color-primary)",
                    }}
                    arrow={false}
                  >
                    <p>{t("common.button.addNew")}</p>
                    <TooltipPrimitive.Arrow
                      style={{
                        fill: "var(--color-primary)",
                        background: "var(--color-primary)",
                      }}
                      className={"size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"}
                    />
                  </TooltipContent>
                </Tooltip>
                <RenderIf value={Array.isArray(data?.data) && data.data.length > 1}>
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
                      <p>{t("common.button.delete")}</p>
                      <TooltipPrimitive.Arrow
                        style={{
                          fill: "var(--color-red-400)",
                          background: "var(--color-red-400)",
                        }}
                        className={
                          "size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
                        }
                      />
                    </TooltipContent>
                  </Tooltip>
                </RenderIf>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <ContractTenantFilter props={props} />
        <DataTable<ContractTenantDetailResponse>
          data={data?.data ?? []}
          columns={buildColumnsFromConfig(
            columnConfigs,
            Array.isArray(data?.data) && data.data.length > 1
          )}
          page={Number(page)}
          size={Number(size)}
          totalElements={data?.meta?.pagination?.total || 0}
          totalPages={data?.meta?.pagination?.totalPages || 0}
          loading={isLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          disableSelect={Array.isArray(data?.data) && data.data.length > 1}
        />
      </div>
      <ConfirmDialog />
      <ConfirmDialogRemoveAll />
    </div>
  );
};

export default ContractTenants;
