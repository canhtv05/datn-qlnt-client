import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { createOrUpdateNotificationSchema } from "@/lib/validation";
import TenantResponse, {
  ApiResponse,
  NotificationFilter,
  NotificationCreationAndUpdateRequest,
  NotificationResponse,
  Option,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useNotification = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const {
    page = "1",
    size = "15",
    query = "",
    notificationType = "",
    fromDate = "",
    toDate = "",
  } = queryFilter(searchParams, "page", "size", "query", "notificationType", "fromDate", "toDate");

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<NotificationCreationAndUpdateRequest>({
    content: "",
    image: "",
    notificationType: "",
    sendToAll: false,
    title: "",
    users: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const { clearErrors, errors, handleZodErrors } =
    useFormErrors<NotificationCreationAndUpdateRequest>();

  const [filterValues, setFilterValues] = useState<NotificationFilter>({
    fromDate,
    notificationType,
    query,
    toDate,
  });

  const handleClear = () => {
    setFilterValues({
      fromDate: "",
      notificationType: "",
      query: "",
      toDate: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set("page", "1");
    setSearchParams(params);
  }, [filterValues, setSearchParams]);

  const { data, isLoading, isError } = useQuery<ApiResponse<NotificationResponse[]>>({
    queryKey: ["notifications", parsedPage, parsedSize, query, fromDate, toDate, notificationType],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: parsedPage.toString(),
        size: parsedSize.toString(),
      };

      Object.entries(filterValues).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const res = await httpRequest.get("/notifications", { params });
      return res.data;
    },
    retry: 1,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateNotificationMutation = useMutation({
    mutationKey: ["update-meter-notification"],
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

      return await httpRequest.put(`/notifications/${idRef.current}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    },
    onError: (error) => {
      handleMutationError(error);
    },
    onSuccess: () => {
      setValue({
        content: "",
        image: "",
        notificationType: "",
        sendToAll: true,
        title: "",
        users: [],
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "notifications",
      });
      toast.success(t(Status.UPDATE_SUCCESS));
      setIsModalOpen(false);
    },
  });

  const removeNotificationMutation = useMutation({
    mutationKey: ["remove-meter-notification"],
    mutationFn: async (id: string) => await httpRequest.delete(`/notifications/${id}`),
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "delete") return await handleRemoveNotificationById(id);
      return false;
    },
  });

  const handleRemoveNotificationById = async (id: string): Promise<boolean> => {
    try {
      await removeNotificationMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) && query.queryKey[0] === "notifications",
          });
          toast.success(t(Status.REMOVE_SUCCESS));
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleUpdateNotification = useCallback(async () => {
    try {
      const { content, notificationType, sendToAll, title, users, image } = value;

      const data: NotificationCreationAndUpdateRequest = {
        content: content.trim(),
        title: title.trim(),
        image,
        notificationType,
        sendToAll,
        users,
      };

      await createOrUpdateNotificationSchema.parseAsync(data);
      await updateNotificationMutation.mutateAsync(data);

      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [updateNotificationMutation, clearErrors, handleZodErrors, value]);

  const handleActionClick = useCallback(
    (notification: NotificationResponse, action: "update" | "delete") => {
      idRef.current = notification.id;
      if (action === "update") {
        setValue({
          content: notification.content,
          notificationType: notification.notificationType,
          sendToAll: notification.sendToAll,
          title: notification.title,
          image: notification.image,
          users: notification.sentToUsers.map((u) => u.id),
        });
        setIsModalOpen(true);
      } else {
        openDialog({ id: notification.id, type: action }, { type: "warn", desc: t(Notice.REMOVE) });
      }
    },
    [openDialog, t]
  );

  const { data: tenantAll, isError: errorTenantAll } = useQuery<ApiResponse<TenantResponse[]>>({
    queryKey: ["tenants-all"],
    queryFn: async () => {
      const res = await httpRequest.get("/tenants/all");
      return res.data;
    },
    retry: 1,
  });

  const tenantOptions: Option[] = useMemo(
    () =>
      tenantAll?.data.map((t) => ({
        label: t.fullName,
        value: t.userId ?? "",
      })) ?? [],
    [tenantAll?.data]
  );

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
  };

  useEffect(() => {
    if (isError) toast.error(t("systemNotification.error.load"));
    if (errorTenantAll) toast.error(t("notification.error.loadTenant"));
  }, [errorTenantAll, isError, t]);

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      ...filterValues,
    },
    tenantAll,
    setSearchParams,
    props,
    data,
    isLoading,
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
  };
};
