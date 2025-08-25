import { Notice, Status } from "@/enums";
import { useConfirmDialog } from "@/hooks";
import { ApiResponse, IBtnType, VehicleFilterValues, VehicleResponse } from "@/types";
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

export const useHistoryVehicle = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    vehicleType = "",
    licensePlate = "",
  } = queryFilter(searchParams, "page", "size", "vehicleType", "licensePlate");

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<VehicleFilterValues>({
    licensePlate,
    vehicleType,
  });

  const handleClear = () => {
    setFilterValues({
      licensePlate: "",
      vehicleType: "",
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

  const { data, isLoading, isError } = useQuery<ApiResponse<VehicleResponse[]>>({
    queryKey: ["vehicles-cancel", page, size, licensePlate, vehicleType],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      Object.entries(filterValues).forEach(([k, v]) => {
        if (v) params[k] = v;
      });

      const res = await httpRequest.get("/vehicles/cancel", {
        params,
      });

      return res.data;
    },

    retry: 1,
  });

  const removeVehicleMutation = useMutation({
    mutationKey: ["remove-vehicle"],
    mutationFn: async (id: string) => await httpRequest.delete(`/vehicles/${id}`),
  });

  const handleRemoveVehicleById = async (id: string): Promise<boolean> => {
    try {
      await removeVehicleMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "vehicles",
          });
          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) && query.queryKey[0] === "vehicles-cancel",
          });
          queryClient.invalidateQueries({ queryKey: ["vehicle-statistics"] });

          toast.success(t(Status.REMOVE_SUCCESS));
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const restoreVehicleMutation = useMutation({
    mutationKey: ["restore-vehicle"],
    mutationFn: async (id: string) => await httpRequest.put(`/vehicles/restore/${id}`),
  });

  const handleRestoreVehicleById = async (id: string): Promise<boolean> => {
    try {
      await restoreVehicleMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "vehicles",
          });
          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) && query.queryKey[0] === "vehicles-cancel",
          });
          queryClient.invalidateQueries({ queryKey: ["vehicle-statistics"] });

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
        return await handleRemoveVehicleById(id);
      } else {
        return await handleRestoreVehicleById(id);
      }
    },
  });

  const { ConfirmDialog: ConfirmDialogRemoveAll, openDialog: openDialogAll } =
    useConfirmDialog<BulkRemovePayload>({
      onConfirm: async ({ ids, type }) => {
        if (!ids || !Object.values(ids).some(Boolean)) return false;
        if (type === "remove") {
          return await handleRemoveVehicleByIds(ids);
        } else {
          return await handleRestoreVehicleByIds(ids);
        }
      },
    });

  const handleRemoveVehicleByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeVehicleMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "vehicles",
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "vehicles-cancel",
      });
      queryClient.invalidateQueries({ queryKey: ["vehicle-statistics"] });

      toast.success(t(Status.REMOVE_SUCCESS));
      setRowSelection({});
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleRestoreVehicleByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => restoreVehicleMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "vehicles",
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "vehicles-cancel",
      });
      queryClient.invalidateQueries({ queryKey: ["vehicle-statistics"] });

      toast.success(t(Status.RESTORE_SUCCESS));
      setRowSelection({});
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleActionClick = useCallback(
    (vehicle: VehicleResponse, type: IBtnType["type"]) => {
      idRef.current = vehicle.id;
      if (type === "delete") {
        openDialog(
          { id: vehicle.id, type: "remove" },
          {
            type: "warn",
            desc: t(Notice.REMOVE),
          }
        );
      } else {
        openDialog(
          { id: vehicle.id, type: "restore" },
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
