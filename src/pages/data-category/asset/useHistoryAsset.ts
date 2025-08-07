import { AssetStatus, Notice, Status } from "@/enums";
import { useConfirmDialog } from "@/hooks";
import { ApiResponse, AssetFilter, AssetResponse, IBtnType, PaginatedResponse } from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

type BulkRemovePayload = {
  ids: Record<string, boolean>;
  type: "remove" | "undo";
};

export const useHistoryAsset = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    nameAsset = "",
    assetBeLongTo = "",
    assetStatus = AssetStatus.HUY,
    assetType = "",
  } = queryFilter(searchParams, "page", "size", "nameAsset", "assetType", "assetBeLongTo", "assetStatus");

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<AssetFilter>({
    nameAsset,
    assetBeLongTo,
    assetStatus,
    assetType,
  });

  const handleClear = () => {
    setFilterValues({
      assetType: "",
      assetBeLongTo: "",
      assetStatus: "",
      nameAsset: "",
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

  const { data, isLoading, isError } = useQuery<ApiResponse<PaginatedResponse<AssetResponse[]>>>({
    queryKey: ["assets-cancel", page, size, assetType, assetStatus, assetBeLongTo, nameAsset],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      Object.entries(filterValues).forEach(([k, v]) => {
        if (v) params[k] = v;
      });

      if (id) params["buildingId"] = id;
      if (assetStatus) params.assetStatus = AssetStatus.HUY;

      const res = await httpRequest.get("/assets/cancel", {
        params,
      });

      return res.data;
    },
    enabled: !!id,
    retry: 1,
  });

  const removeAssetMutation = useMutation({
    mutationKey: ["remove-asset"],
    mutationFn: async (id: string) => await httpRequest.delete(`/assets/${id}`),
  });

  const handleRemoveAssetById = async (id: string): Promise<boolean> => {
    try {
      await removeAssetMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "assets",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "assets-cancel",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "asset-statistics",
          });
          toast.success(Status.REMOVE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const restoreAssetMutation = useMutation({
    mutationKey: ["restore-asset"],
    mutationFn: async (id: string) => await httpRequest.put(`/assets/restore/${id}`),
  });

  const handleRestoreAssetById = async (id: string): Promise<boolean> => {
    try {
      await restoreAssetMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "assets",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "assets-cancel",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "asset-statistics",
          });
          toast.success(Status.RESTORE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "restore" | "remove" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "remove") {
        return await handleRemoveAssetById(id);
      } else {
        return await handleRestoreAssetById(id);
      }
    },
  });

  const { ConfirmDialog: ConfirmDialogRemoveAll, openDialog: openDialogAll } = useConfirmDialog<BulkRemovePayload>({
    onConfirm: async ({ ids, type }) => {
      if (!ids || !Object.values(ids).some(Boolean)) return false;
      if (type === "remove") {
        return await handleRemoveAssetByIds(ids);
      } else {
        return await handleRestoreAssetByIds(ids);
      }
    },
  });

  const handleRemoveAssetByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeAssetMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "assets",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "assets-cancel",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "asset-statistics",
      });
      toast.success(Status.REMOVE_SUCCESS);
      setRowSelection({});
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleRestoreAssetByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => restoreAssetMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "assets",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "assets-cancel",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "asset-statistics",
      });
      toast.success(Status.RESTORE_SUCCESS);
      setRowSelection({});
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleActionClick = useCallback(
    (asset: AssetResponse, type: IBtnType["type"]) => {
      idRef.current = asset.id;
      if (type === "delete") {
        openDialog(
          { id: asset.id, type: "remove" },
          {
            type: "warn",
            desc: Notice.REMOVE,
          }
        );
      } else {
        openDialog(
          { id: asset.id, type: "restore" },
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
      toast.error("Có lỗi xảy ra khi tải tài sản");
    }
  }, [isError]);

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
