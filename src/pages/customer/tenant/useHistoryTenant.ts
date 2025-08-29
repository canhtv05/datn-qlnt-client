import { Notice, Status, TenantStatus } from "@/enums";
import { useConfirmDialog } from "@/hooks";
import TenantResponse, { ApiResponse, IBtnType, TenantFilterValues } from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

type BulkRemovePayload = {
  ids: Record<string, boolean>;
  type: "remove" | "undo";
};

export const useHistoryTenant = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    query = "",
    gender = "",
    tenantStatus = TenantStatus.HUY_BO,
  } = queryFilter(searchParams, "page", "size", "query", "gender", "tenantStatus");

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<TenantFilterValues>({
    gender,
    query,
    tenantStatus,
  });

  const handleClear = () => {
    setFilterValues({
      gender: "",
      query: "",
      tenantStatus: "",
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

  const { data, isLoading, isError } = useQuery<ApiResponse<TenantResponse[]>>({
    queryKey: ["tenants-cancel", page, size, query, tenantStatus, gender],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      Object.entries(filterValues).forEach(([k, v]) => {
        if (v) params[k] = v;
      });

      if (tenantStatus) params.tenantStatus = TenantStatus.HUY_BO;

      const res = await httpRequest.get("/tenants/cancel", {
        params,
      });

      return res.data;
    },

    retry: 1,
  });

  const removeTenantMutation = useMutation({
    mutationKey: ["remove-tenant"],
    mutationFn: async (id: string) => await httpRequest.delete(`/tenants/${id}`),
  });

  const handleRemoveTenantById = async (id: string): Promise<boolean> => {
    try {
      await removeTenantMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "tenants",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "tenants-cancel",
          });
          queryClient.invalidateQueries({ queryKey: ["tenants-statistics"] });

          toast.success(t(Status.REMOVE_SUCCESS));
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const restoreTenantMutation = useMutation({
    mutationKey: ["restore-tenant"],
    mutationFn: async (id: string) => await httpRequest.put(`/tenants/restore/${id}`),
  });

  const handleRestoreTenantById = async (id: string): Promise<boolean> => {
    try {
      await restoreTenantMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "tenants",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "tenants-cancel",
          });
          queryClient.invalidateQueries({ queryKey: ["tenants-statistics"] });

          toast.success(t(Status.RESTORE_SUCCESS));
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const { ConfirmDialog, openDialog } = useConfirmDialog<{
    id: string;
    type: "restore" | "remove";
  }>({
    onConfirm: async ({ id, type }) => {
      if (type === "remove") {
        return await handleRemoveTenantById(id);
      } else {
        return await handleRestoreTenantById(id);
      }
    },
  });

  const { ConfirmDialog: ConfirmDialogRemoveAll, openDialog: openDialogAll } = useConfirmDialog<BulkRemovePayload>({
    onConfirm: async ({ ids, type }) => {
      if (!ids || !Object.values(ids).some(Boolean)) return false;
      if (type === "remove") {
        return await handleRemoveTenantByIds(ids);
      } else {
        return await handleRestoreTenantByIds(ids);
      }
    },
  });

  const handleRemoveTenantByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeTenantMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "tenants",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "tenants-cancel",
      });
      queryClient.invalidateQueries({ queryKey: ["tenants-statistics"] });

      toast.success(t(Status.REMOVE_SUCCESS));
      setRowSelection({});
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleRestoreTenantByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => restoreTenantMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "tenants",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "tenants-cancel",
      });
      queryClient.invalidateQueries({ queryKey: ["tenants-statistics"] });

      toast.success(t(Status.RESTORE_SUCCESS));
      setRowSelection({});
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleActionClick = useCallback(
    (tenant: TenantResponse, type: IBtnType["type"]) => {
      idRef.current = tenant.id;
      if (type === "delete") {
        openDialog(
          { id: tenant.id, type: "remove" },
          {
            type: "warn",
            desc: t(Notice.REMOVE),
          }
        );
      } else {
        openDialog(
          { id: tenant.id, type: "restore" },
          {
            type: "default",
            desc: t(Notice.RESTORE),
          }
        );
      }
    },
    [openDialog, t]
  );

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
  };

  useEffect(() => {
    if (isError) {
      toast.error(t("tenant.errorFetch"));
    }
  }, [isError, t]);

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      ...filterValues,
    },
    setSearchParams,
    props,
    data,
    isLoading,
    handleActionClick,
    rowSelection,
    setRowSelection,
    ConfirmDialog,
    ConfirmDialogRemoveAll,
    openDialogAll,
  };
};
