import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import TenantResponse, { ColumnConfig } from "@/types";
import { useHistoryTenant } from "./useHistoryTenant";
import { BUTTON_HISTORY, GET_BTNS } from "@/constant";
import { Notice } from "@/enums";
// import StatusBadge from "@/components/ui/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import TenantFilter from "@/components/customer/tenant/TenantFilter";
import { useTranslation } from "react-i18next";

const HistoryTenant = () => {
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
  } = useHistoryTenant();
  const { page, size } = query;
  const { t } = useTranslation();

  const columnConfigs: ColumnConfig[] = [
    {
      label: t("tenant.response.customerCode"),
      accessorKey: "customerCode",
      isSort: true,
      hasHighlight: true,
    },
    {
      label: t("tenant.response.actions"),
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: TenantResponse) => {
        const tenant: TenantResponse = row;
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
                        handleActionClick(tenant, btn.type);
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
    { label: t("tenant.response.fullName"), accessorKey: "fullName", isSort: true },
    {
      label: t("tenant.response.pictureUrl"),
      accessorKey: "pictureUrl",
      isCenter: true,
      render(row) {
        return (
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.pictureUrl} alt={row.fullName} />
            <AvatarFallback>{row.fullName?.charAt(0).toUpperCase() || "N/A"}</AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      label: t("tenant.response.gender"),
      accessorKey: "gender",
      isSort: true,
      isCenter: true,
      hasBadge: true,
    },
    {
      label: t("tenant.response.dob"),
      accessorKey: "dob",
      isSort: true,
    },
    { label: t("tenant.response.email"), accessorKey: "email", isSort: true },
    { label: t("tenant.response.phoneNumber"), accessorKey: "phoneNumber", isSort: true },
    // { label: "Địa chỉ", accessorKey: "address", isHidden: true },
    // { label: "Số CMND/CCCD", accessorKey: "identityCardNumber", isHidden: true },
    // {
    //   label: "Đại diện hộ",
    //   accessorKey: "isRepresentative",
    //   isCenter: true,
    //   isSort: true,
    //   render: (row: TenantResponse) => {
    //     return row.isRepresentative ? (
    //       <StatusBadge status={"isRepresentative=true"} />
    //     ) : (
    //       <StatusBadge status={"isRepresentative=false"} />
    //     );
    //   },
    // },
    {
      label: t("tenant.response.tenantStatus"),
      accessorKey: "tenantStatus",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
  ];

  return (
    <div className="flex flex-col shadow-lg rounded-md">
      <div className="pb-5 rounded-t-sm bg-background rounded-b-sm">
        <div className="h-full bg-background rounded-t-sm">
          <div className="flex px-5 py-3 justify-between items-center">
            <h3 className="font-semibold">{t("tenant.titleHistory")}</h3>
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
                                desc: t("common.confirmDialog.delete"),
                                type: "warn",
                              }
                            );
                          } else if (btn.type === "undo") {
                            openDialogAll(
                              { ids: rowSelection, type: "undo" },
                              {
                                desc: t(Notice.RESTORES),
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
                        className={
                          "size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
                        }
                      />
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
        </div>
        <TenantFilter props={props} type="restore" />
        <DataTable<TenantResponse>
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

export default HistoryTenant;
