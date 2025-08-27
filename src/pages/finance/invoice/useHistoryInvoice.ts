import { InvoiceStatus, Notice, Status } from "@/enums";
import { useConfirmDialog } from "@/hooks";
import {
  ApiResponse,
  InvoiceResponse,
  IBtnType,
  InvoiceFilter,
  BuildingSelectResponse,
} from "@/types";
import cookieUtil from "@/utils/cookieUtil";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isNumber } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

type BulkRemovePayload = {
  ids: Record<string, boolean>;
  type: "remove" | "undo";
};

export const useHistoryInvoice = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    building = "",
    floor = "",
    month = "",
    year = "",
    minTotalAmount = "",
    maxTotalAmount = "",
    invoiceStatus = InvoiceStatus.HUY,
    invoiceType = "",
    query = "",
  } = queryFilter(
    searchParams,
    "page",
    "size",
    "building",
    "floor",
    "month",
    "year",
    "minTotalAmount",
    "maxTotalAmount",
    "invoiceStatus",
    "invoiceType",
    "query"
  );

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<InvoiceFilter>({
    building,
    floor,
    invoiceStatus,
    invoiceType,
    maxTotalAmount: isNumber(maxTotalAmount) ? Number(maxTotalAmount) : undefined,
    minTotalAmount: isNumber(minTotalAmount) ? Number(minTotalAmount) : undefined,
    month: isNumber(month) ? Number(month) : undefined,
    year: isNumber(year) ? Number(year) : undefined,
    query,
  });

  const handleClear = () => {
    setFilterValues({
      building: "",
      floor: "",
      month: undefined,
      year: undefined,
      minTotalAmount: undefined,
      maxTotalAmount: undefined,
      invoiceStatus: InvoiceStatus.HUY,
      invoiceType: "",
      query: "",
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

  const { data, isLoading, isError } = useQuery<ApiResponse<InvoiceResponse[]>>({
    queryKey: [
      "invoices-cancel",
      page,
      size,
      building,
      floor,
      invoiceStatus,
      invoiceType,
      maxTotalAmount,
      minTotalAmount,
      month,
      query,
      year,
    ],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: parsedPage.toString(),
        size: parsedSize.toString(),
      };
      Object.entries(filterValues).forEach(([k, v]) => {
        if (v) params[k] = v;
      });

      const res = await httpRequest.get("/invoices/cancel", {
        params,
      });

      return res.data;
    },
    retry: 1,
  });

  const removeInvoiceMutation = useMutation({
    mutationKey: ["remove-invoice"],
    mutationFn: async (id: string) => await httpRequest.delete(`/invoices/${id}`),
  });

  const handleRemoveInvoiceById = async (id: string): Promise<boolean> => {
    try {
      await removeInvoiceMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "invoices",
          });
          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) && query.queryKey[0] === "invoices-cancel",
          });
          queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });

          toast.success(t(Status.REMOVE_SUCCESS));
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const restoreInvoiceMutation = useMutation({
    mutationKey: ["restore-invoice"],
    mutationFn: async (id: string) => await httpRequest.put(`/invoices/restore/${id}`),
  });

  const handleRestoreInvoiceById = async (id: string): Promise<boolean> => {
    try {
      await restoreInvoiceMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "invoices",
          });
          queryClient.invalidateQueries({
            predicate: (query) =>
              Array.isArray(query.queryKey) && query.queryKey[0] === "invoices-cancel",
          });
          queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });

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
    type: "restore" | "remove" | "view";
  }>({
    onConfirm: async ({ id, type }) => {
      if (type === "remove") {
        return await handleRemoveInvoiceById(id);
      } else {
        return await handleRestoreInvoiceById(id);
      }
    },
  });

  const { ConfirmDialog: ConfirmDialogRemoveAll, openDialog: openDialogAll } =
    useConfirmDialog<BulkRemovePayload>({
      onConfirm: async ({ ids, type }) => {
        if (!ids || !Object.values(ids).some(Boolean)) return false;
        if (type === "remove") {
          return await handleRemoveInvoiceByIds(ids);
        } else {
          return await handleRestoreInvoiceByIds(ids);
        }
      },
    });

  const handleRemoveInvoiceByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeInvoiceMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "invoices",
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "invoices-cancel",
      });
      queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });

      toast.success(t(Status.REMOVE_SUCCESS));
      setRowSelection({});
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleRestoreInvoiceByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => restoreInvoiceMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "invoices",
      });
      queryClient.invalidateQueries({
        predicate: (query) =>
          Array.isArray(query.queryKey) && query.queryKey[0] === "invoices-cancel",
      });
      queryClient.invalidateQueries({ queryKey: ["invoice-statistics"] });

      toast.success(t(Status.RESTORE_SUCCESS));
      setRowSelection({});
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleActionClick = useCallback(
    (invoice: InvoiceResponse, type: IBtnType["type"]) => {
      idRef.current = invoice.id;
      if (type === "delete") {
        openDialog(
          { id: invoice.id, type: "remove" },
          {
            type: "warn",
            desc: t(Notice.REMOVE),
          }
        );
      } else if (type === "view") {
        navigate(`/finance/invoice/${invoice.id}`, {
          replace: true,
        });
        cookieUtil.setStorage({ roomId: invoice.roomId });
      } else {
        openDialog(
          { id: invoice.id, type: "restore" },
          {
            type: "default",
            desc: t(Notice.RESTORE),
          }
        );
      }
    },
    [navigate, openDialog, t]
  );

  const { data: buildingFilter, isError: errorBuildingFilter } = useQuery<
    ApiResponse<BuildingSelectResponse[]>
  >({
    queryKey: ["buildingFilter"],
    queryFn: async () => {
      const res = await httpRequest.get("/buildings/init");
      return res.data;
    },
    retry: false,
  });

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
    buildingFilter,
  };

  useEffect(() => {
    if (isError) {
      toast.error(t("service.errorFetch"));
    }

    if (errorBuildingFilter) {
      toast.error(t("building.errorFetch"));
    }
  }, [errorBuildingFilter, isError, t]);

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
