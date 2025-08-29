import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import Modal from "@/components/Modal";
import { useCallback, useState } from "react";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent } from "react";
import { toast } from "sonner";
import { Notice, NotificationType, Status } from "@/enums";
import { createOrUpdateNotificationSchema } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import {
  IBtnType,
  NotificationCreationAndUpdateRequest,
  NotificationResponse,
  Option,
} from "@/types";
import { ACTION_BUTTONS } from "@/constant";
import RenderIf from "@/components/RenderIf";
import { useConfirmDialog } from "@/hooks";
import AddOrUpdateNotification from "./AddOrUpdateNotification";
import { formatDate, handleExportExcel, notificationTypeEnumToString } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const NotificationButton = ({
  ids,
  tennantOptions,
  data,
}: {
  data?: NotificationResponse[];
  ids: Record<string, boolean>;
  tennantOptions: Option[];
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<NotificationCreationAndUpdateRequest>({
    content: "",
    notificationType: NotificationType.CHUNG,
    sendToAll: true,
    title: "",
    image: null,
    users: [],
  });

  const { clearErrors, errors, handleZodErrors } =
    useFormErrors<NotificationCreationAndUpdateRequest>();

  const queryClient = useQueryClient();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNotificationMutation = useMutation({
    mutationKey: ["add-notification"],
    mutationFn: async (payload: NotificationCreationAndUpdateRequest) => {
      const formData = new FormData();
      formData.append("title", payload.title);
      formData.append("content", payload.content);
      formData.append("notificationType", payload.notificationType);
      formData.append("sendToAll", String(payload.sendToAll));

      if (payload.users && payload.users.length > 0) {
        payload.users.forEach((userId) => {
          formData.append("users", userId);
        });
      }

      if (payload.image instanceof File) {
        formData.append("image", payload.image);
      }

      return await httpRequest.post("/notifications", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(t(Status.ADD_SUCCESS));
      setValue({
        content: "",
        notificationType: NotificationType.CHUNG,
        sendToAll: true,
        title: "",
        image: null,
        users: [],
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "notifications",
      });
    },
  });

  const handleAddNotification = useCallback(async () => {
    try {
      const { content, notificationType, sendToAll, title, users, image } = value;

      const data: NotificationCreationAndUpdateRequest = {
        content: content.trim(),
        title: title.trim(),
        image,
        notificationType,
        sendToAll: String(sendToAll) === "true" ? true : false,
        users,
      };

      await createOrUpdateNotificationSchema.parseAsync(data);
      await addNotificationMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addNotificationMutation, clearErrors, handleZodErrors, value]);

  const handleRemoveMeterReadingByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeNotificationMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "notifications",
      });

      toast.success(t(Status.REMOVE_SUCCESS));
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const { ConfirmDialog, openDialog } = useConfirmDialog<Record<string, boolean>>({
    onConfirm: async (ids?: Record<string, boolean>) => {
      if (!ids || !Object.values(ids).some(Boolean)) return false;
      return await handleRemoveMeterReadingByIds(ids);
    },
    desc: t("common.confirmDialog.delete"),
    type: "warn",
  });

  const handleButton = useCallback(
    (btn: IBtnType) => {
      if (btn.type === "delete") {
        openDialog(ids);
      } else if (btn.type === "download") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const exportData: Record<string, any>[] | undefined = data?.map((d) => ({
          [t("notification.response.title")]: d.title,
          [t("notification.response.content")]: d.content,
          [t("notification.response.image")]: d.image,
          [t("notification.response.notificationType")]: notificationTypeEnumToString(
            d.notificationType,
            t
          ),
          [t("notification.response.sendToAll")]: d.sendToAll
            ? t("statusBadge.yes")
            : t("statusBadge.no"),
          [t("notification.response.sentAt")]: formatDate(d.sentAt),
          [t("notification.response.fullName")]: d.fullName,
          [t("notification.response.sentToUsers")]: d.sentToUsers.map((u) => u.fullName).join(", "),
        }));
        handleExportExcel(t("notification.title"), exportData, data);
      }
    },
    [data, ids, openDialog, t]
  );

  const removeNotificationMutation = useMutation({
    mutationKey: ["remove-notification"],
    mutationFn: async (id: string) => await httpRequest.delete(`/notifications/${id}`),
  });

  return (
    <div className="h-full bg-background rounded-t-sm">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">{t("notification.title")}</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title={t("notification.title")}
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={t(Notice.ADD)}
                    onConfirm={handleAddNotification}
                  >
                    <AddOrUpdateNotification
                      handleChange={handleChange}
                      value={value}
                      setValue={setValue}
                      errors={errors}
                      tennantOptions={tennantOptions}
                    />
                  </Modal>
                </RenderIf>
                <RenderIf value={btn.type !== "default"}>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => handleButton(btn)}
                      disabled={btn.type === "delete" && !Object.values(ids).some(Boolean)}
                    >
                      <btn.icon className="text-white" />
                    </Button>
                  </TooltipTrigger>
                </RenderIf>
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
      <ConfirmDialog />
    </div>
  );
};

export default NotificationButton;
