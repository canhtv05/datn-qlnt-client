import { ContractStatus, Notice, Status } from "@/enums";
import { useConfirmDialog } from "@/hooks";
import { ApiResponse, IBtnType, ContractFilterValues, ContractResponse } from "@/types";
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

export const useHistoryContract = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    query = "",
    status = ContractStatus.DA_HUY,
  } = queryFilter(searchParams, "page", "size", "query", "status");

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<ContractFilterValues>({
    query,
    status,
  });

  const handleClear = () => {
    setFilterValues({ query: "", status: "" });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filterValues).forEach(([key, val]) => {
      if (val) params.set(key, val);
    });
    params.set("page", "1");
    setSearchParams(params);
  }, [filterValues, setSearchParams]);

  const { data, isLoading, isError } = useQuery<ApiResponse<ContractResponse[]>>({
    queryKey: ["contracts-cancel", page, size, query, status],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: parsedPage.toString(),
        size: parsedSize.toString(),
      };
      Object.entries(filterValues).forEach(([k, v]) => {
        if (v) params[k] = v;
      });

      if (status) params.status = ContractStatus.DA_HUY;
      const res = await httpRequest.get("/contracts/cancel", {
        params,
      });

      return res.data;
    },
    retry: 1,
  });

  const removeContractMutation = useMutation({
    mutationKey: ["remove-contract"],
    mutationFn: async (id: string) => await httpRequest.delete(`/contracts/${id}`),
  });

  const handleRemoveContractById = async (id: string): Promise<boolean> => {
    try {
      await removeContractMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contracts",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contracts-cancel",
          });
          queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });

          toast.success(t(Status.REMOVE_SUCCESS));
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const restoreContractMutation = useMutation({
    mutationKey: ["restore-contract"],
    mutationFn: async (id: string) => await httpRequest.put(`/contracts/restore/${id}`),
  });

  const handleRestoreContractById = async (id: string): Promise<boolean> => {
    try {
      await restoreContractMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contracts",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contracts-cancel",
          });
          queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });

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
        return await handleRemoveContractById(id);
      } else {
        return await handleRestoreContractById(id);
      }
    },
  });

  const { ConfirmDialog: ConfirmDialogRemoveAll, openDialog: openDialogAll } = useConfirmDialog<BulkRemovePayload>({
    onConfirm: async ({ ids, type }) => {
      if (!ids || !Object.values(ids).some(Boolean)) return false;
      if (type === "remove") {
        return await handleRemoveContractByIds(ids);
      } else {
        return await handleRestoreContractByIds(ids);
      }
    },
  });

  const handleRemoveContractByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeContractMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contracts",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contracts-cancel",
      });
      queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });

      toast.success(t(Status.REMOVE_SUCCESS));
      setRowSelection({});
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleRestoreContractByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => restoreContractMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contracts",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "contracts-cancel",
      });
      queryClient.invalidateQueries({ queryKey: ["contracts-statistics"] });

      toast.success(t(Status.RESTORE_SUCCESS));
      setRowSelection({});
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleActionClick = useCallback(
    (contract: ContractResponse, type: IBtnType["type"]) => {
      idRef.current = contract.id;
      if (type === "delete") {
        openDialog(
          { id: contract.id, type: "remove" },
          {
            type: "warn",
            desc: Notice.REMOVE,
          }
        );
      } else {
        openDialog(
          { id: contract.id, type: "restore" },
          {
            type: "default",
            desc: Notice.RESTORE,
          }
        );
      }
    },
    [openDialog]
  );

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
  };

  useEffect(() => {
    if (isError) {
      toast.error(t("contract.errorFetch"));
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
