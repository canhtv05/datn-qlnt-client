import { Notice, ServiceStatus, Status } from "@/enums";
import { useConfirmDialog } from "@/hooks";
import { ApiResponse, ServiceResponse, FloorResponse, IBtnType, ServiceFilter } from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isNumber } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

type BulkRemovePayload = {
  ids: Record<string, boolean>;
  type: "remove" | "undo";
};

export const useHistoryService = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    query = "",
    serviceCategory = "",
    minPrice = "",
    maxPrice = "",
    serviceStatus = ServiceStatus.KHONG_SU_DUNG,
    serviceCalculation = "",
  } = queryFilter(
    searchParams,
    "page",
    "size",
    "query",
    "serviceCategory",
    "minPrice",
    "maxPrice",
    "serviceStatus",
    "serviceCalculation"
  );

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<ServiceFilter>({
    maxPrice: isNumber(maxPrice) ? Number(maxPrice) : undefined,
    minPrice: isNumber(minPrice) ? Number(minPrice) : undefined,
    query,
    serviceStatus,
    serviceCalculation,
    serviceCategory,
  });

  const handleClear = () => {
    setFilterValues({
      maxPrice: undefined,
      minPrice: undefined,
      query: "",
      serviceStatus: ServiceStatus.KHONG_SU_DUNG,
      serviceCalculation: "",
      serviceCategory: "",
    });
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

  const { data, isLoading, isError } = useQuery<ApiResponse<FloorResponse[]>>({
    queryKey: [
      "services-cancel",
      page,
      size,
      maxPrice,
      minPrice,
      query,
      serviceStatus,
      serviceCalculation,
      serviceCategory,
    ],
    queryFn: async () => {
      const params: Record<string, string> = { page: parsedPage.toString(), size: parsedSize.toString() };
      Object.entries(filterValues).forEach(([k, v]) => {
        if (v) params[k] = v;
      });

      const res = await httpRequest.get("/services/cancel", {
        params,
      });

      return res.data;
    },
    retry: 1,
  });

  const removeServiceMutation = useMutation({
    mutationKey: ["remove-service"],
    mutationFn: async (id: string) => await httpRequest.delete(`/services/delete/${id}`),
  });

  const handleRemoveServiceById = async (id: string): Promise<boolean> => {
    try {
      await removeServiceMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "services-cancel",
          });
          queryClient.invalidateQueries({ queryKey: ["service-statistics"] });

          toast.success(Status.REMOVE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const restoreServiceMutation = useMutation({
    mutationKey: ["restore-service"],
    mutationFn: async (id: string) => await httpRequest.put(`/services/restore/${id}`),
  });

  const handleRestoreServiceById = async (id: string): Promise<boolean> => {
    try {
      await restoreServiceMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "services-cancel",
          });
          queryClient.invalidateQueries({ queryKey: ["service-statistics"] });

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
        return await handleRemoveServiceById(id);
      } else {
        return await handleRestoreServiceById(id);
      }
    },
  });

  const { ConfirmDialog: ConfirmDialogRemoveAll, openDialog: openDialogAll } = useConfirmDialog<BulkRemovePayload>({
    onConfirm: async ({ ids, type }) => {
      if (!ids || !Object.values(ids).some(Boolean)) return false;
      if (type === "remove") {
        return await handleRemoveServiceByIds(ids);
      } else {
        return await handleRestoreServiceByIds(ids);
      }
    },
  });

  const handleRemoveServiceByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeServiceMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "services-cancel",
      });
      queryClient.invalidateQueries({ queryKey: ["service-statistics"] });

      toast.success(Status.REMOVE_SUCCESS);
      setRowSelection({});
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleRestoreServiceByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => restoreServiceMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "services-cancel",
      });
      queryClient.invalidateQueries({ queryKey: ["service-statistics"] });

      toast.success(Status.RESTORE_SUCCESS);
      setRowSelection({});
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleActionClick = useCallback(
    (service: ServiceResponse, type: IBtnType["type"]) => {
      idRef.current = service.id;
      if (type === "delete") {
        openDialog(
          { id: service.id, type: "remove" },
          {
            type: "warn",
            desc: Notice.REMOVE,
          }
        );
      } else {
        openDialog(
          { id: service.id, type: "restore" },
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
      toast.error("Có lỗi xảy ra khi tải dịch vụ");
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
