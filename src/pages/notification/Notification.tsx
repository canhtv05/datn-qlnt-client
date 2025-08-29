import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, NotificationResponse } from "@/types";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import { GET_BTNS } from "@/constant";
import { useNotification } from "./useNotification";
import NotificationFilter from "@/components/notification/NotificationFilter";
import AddOrUpdateNotification from "@/components/notification/AddOrUpdateNotification";
import NotificationButton from "@/components/notification/NotificationButton";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTranslation } from "react-i18next";

const Notification = () => {
  const {
    props,
    data,
    isLoading,
    query,
    handleActionClick,
    rowSelection,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    handleUpdateNotification,
    value,
    setValue,
    errors,
    ConfirmDialog,
    tenantOptions,
  } = useNotification();
  const { page, size } = query;
  const { t } = useTranslation();

  const columnConfigs: ColumnConfig[] = [
    {
      label: t("notification.response.title"),
      accessorKey: "title",
      isSort: false,
    },
    {
      label: t("notification.response.content"),
      accessorKey: "content",
      isSort: false,
    },
    {
      label: t("notification.response.actions"),
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: NotificationResponse) => {
        return (
          <div className="flex gap-2">
            {GET_BTNS("update", "delete").map((btn, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => {
                        const type = btn.type as "update";
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
      label: t("notification.response.image"),
      accessorKey: "image",
      isSort: false,
      render: (row: NotificationResponse) => {
        return row.image ? (
          <img src={row.image} alt={row.content} className="size-9" />
        ) : (
          <StatusBadge status={"__EMPTY__"} />
        );
      },
      isCenter: true,
    },
    {
      label: t("notification.response.notificationType"),
      accessorKey: "notificationType",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: t("notification.response.sendToAll"),
      accessorKey: "sendToAll",
      isSort: true,
      render: (row: NotificationResponse) => {
        return row.sendToAll ? t("statusBadge.yes") : t("statusBadge.no");
      },
      isCenter: true,
    },
    {
      label: t("notification.response.sentAt"),
      accessorKey: "sentAt",
      isSort: true,
      hasDate: true,
    },
    {
      label: t("notification.response.fullName"),
      accessorKey: "fullName",
      isSort: true,
      isCenter: true,
    },
    {
      label: t("notification.response.sentToUsers"),
      accessorKey: "sentToUsers",
      render: (row: NotificationResponse) => {
        return row.sentToUsers.length > 0 ? (
          <span>
            {row.sentToUsers
              .map((u) => u.fullName)
              .join(`${row.sentToUsers.length > 1 ? ", " : ""}`)}
          </span>
        ) : (
          <StatusBadge status={"__EMPTY__"} />
        );
      },
    },
    {
      label: "ID",
      accessorKey: "id",
      isHidden: true,
    },
  ];

  return (
    <div className="flex flex-col">
      <NotificationButton
        ids={rowSelection}
        data={data?.data ?? []}
        tennantOptions={tenantOptions}
      />
      <div className="shadow-lg">
        <NotificationFilter props={props} />
        <DataTable<NotificationResponse>
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
        <Modal
          title={t("notification.title")}
          trigger={null}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onConfirm={handleUpdateNotification}
          desc={t(Notice.UPDATE)}
        >
          <AddOrUpdateNotification
            tennantOptions={tenantOptions}
            handleChange={handleChange}
            value={value}
            setValue={setValue}
            errors={errors}
          />
        </Modal>
        <ConfirmDialog />
      </div>
    </div>
  );
};

export default Notification;
