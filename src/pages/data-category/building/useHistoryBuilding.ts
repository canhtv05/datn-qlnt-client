import { Notice, Status } from "@/enums";
import { useConfirmDialog } from "@/hooks";
import { ApiResponse, BuildingResponse, IBtnType } from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

interface FilterValues {
  query: string;
  status: string;
  buildingType: string;
}

type BulkRemovePayload = {
  ids: Record<string, boolean>;
  type: "remove" | "undo";
};

export const useHistoryBuilding = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    query = "",
    status = "",
    buildingType = "",
  } = queryFilter(searchParams, "page", "size", "query", "status", "buildingType");

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<FilterValues>({
    query,
    status,
    buildingType,
  });

  const handleClear = () => {
    setFilterValues({ query: "", status: "", buildingType: "" });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.query) params.set("query", filterValues.query);
    if (filterValues.status) params.set("status", filterValues.status);
    if (filterValues.buildingType) params.set("buildingType", filterValues.buildingType);
    params.set("page", "1");
    if (filterValues.status || filterValues.query || filterValues.buildingType) {
      setSearchParams(params);
    }
  }, [filterValues.buildingType, filterValues.query, filterValues.status, setSearchParams]);

  const { data, isLoading, isError } = useQuery<ApiResponse<BuildingResponse[]>>({
    queryKey: ["buildings-cancel", page, size, status, buildingType, query],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (status) params["status"] = status;
      if (buildingType) params["buildingType"] = buildingType;
      if (query) params["query"] = query;

      const res = await httpRequest.get("/buildings/cancel", {
        params,
      });

      return res.data;
    },

    retry: 1,
  });

  const removeBuildingMutation = useMutation({
    mutationKey: ["remove-building"],
    mutationFn: async (id: string) => await httpRequest.delete(`/buildings/${id}`),
  });

  const handleRemoveBuildingById = async (id: string): Promise<boolean> => {
    try {
      await removeBuildingMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "buildings",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "buildings-cancel",
          });
          queryClient.invalidateQueries({ queryKey: ["building-statistics"] });

          toast.success(Status.REMOVE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const restoreBuildingMutation = useMutation({
    mutationKey: ["restore-building"],
    mutationFn: async (id: string) => await httpRequest.put(`/buildings/restore/${id}`),
  });

  const handleRestoreBuildingById = async (id: string): Promise<boolean> => {
    try {
      await restoreBuildingMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "buildings",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "buildings-cancel",
          });
          queryClient.invalidateQueries({ queryKey: ["building-statistics"] });

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
        return await handleRemoveBuildingById(id);
      } else {
        return await handleRestoreBuildingById(id);
      }
    },
  });

  const { ConfirmDialog: ConfirmDialogRemoveAll, openDialog: openDialogAll } = useConfirmDialog<BulkRemovePayload>({
    onConfirm: async ({ ids, type }) => {
      if (!ids || !Object.values(ids).some(Boolean)) return false;
      if (type === "remove") {
        return await handleRemoveBuildingByIds(ids);
      } else {
        return await handleRestoreBuildingByIds(ids);
      }
    },
  });

  const handleRemoveBuildingByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeBuildingMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "buildings",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "buildings-cancel",
      });
      queryClient.invalidateQueries({ queryKey: ["building-statistics"] });

      toast.success(Status.REMOVE_SUCCESS);
      setRowSelection({});
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleRestoreBuildingByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => restoreBuildingMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "buildings",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "buildings-cancel",
      });
      queryClient.invalidateQueries({ queryKey: ["building-statistics"] });

      toast.success(Status.RESTORE_SUCCESS);
      setRowSelection({});
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleActionClick = useCallback(
    (building: BuildingResponse, type: IBtnType["type"]) => {
      idRef.current = building.id;
      if (type === "delete") {
        openDialog(
          { id: building.id, type: "remove" },
          {
            type: "warn",
            desc: Notice.REMOVE,
          }
        );
      } else {
        openDialog(
          { id: building.id, type: "restore" },
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
      toast.error("Có lỗi xảy ra khi tải tòa nhà");
    }
  }, [isError]);

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      query,
      status,
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
