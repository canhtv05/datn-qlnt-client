import { Notice, Status } from "@/enums";
import { useConfirmDialog } from "@/hooks";
import { ApiResponse, DepositDetailView, DepositFilter } from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useDeposit = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const {
    page = "1",
    size = "15",
    depositStatus = "",
    query = "",
  } = queryFilter(searchParams, "page", "size", "depositStatus", "query");

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<DepositFilter>({
    depositStatus,
    query,
  });

  const handleClear = () => {
    setFilterValues({
      depositStatus: "",
      query: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.query) params.set("query", filterValues.query);
    if (filterValues.depositStatus) params.set("depositStatus", filterValues.depositStatus);
    params.set("page", "1");
    if (filterValues.query || filterValues.depositStatus) {
      setSearchParams(params);
    }
  }, [filterValues.depositStatus, filterValues.query, setSearchParams]);

  const { data, isLoading, isError } = useQuery<ApiResponse<DepositDetailView[]>>({
    queryKey: ["deposits", page, size, query, depositStatus],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (query) params["query"] = query;
      if (depositStatus) params["depositStatus"] = depositStatus;

      const res = await httpRequest.get("/deposits", {
        params,
      });

      return res.data;
    },
    retry: 1,
  });

  const removeDepositMutation = useMutation({
    mutationKey: ["remove-deposit"],
    mutationFn: async (id: string) => await httpRequest.delete(`/deposits/${id}`),
  });

  const refundDepositMutation = useMutation({
    mutationKey: ["refund-deposit"],
    mutationFn: async (id: string) => await httpRequest.post(`/deposits/confirm-refund/${id}`),
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" | "deposit1" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "delete") return await handleRemoveDepositById(id);
      else handleRefundDepositById(id);
      return false;
    },
  });

  const handleRemoveDepositById = async (id: string): Promise<boolean> => {
    try {
      await removeDepositMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "deposits",
          });
          // queryClient.invalidateQueries({ queryKey: ["meter-statistics"] });
          toast.success(t(Status.REMOVE_SUCCESS));
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleRefundDepositById = async (id: string): Promise<boolean> => {
    try {
      await refundDepositMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "deposits",
          });
          // queryClient.invalidateQueries({ queryKey: ["meter-statistics"] });
          toast.success("Trả cọc khách hàng thành công");
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleActionClick = useCallback(
    (deposit: DepositDetailView, action: "delete" | "deposit1") => {
      idRef.current = deposit.id;
      if (action === "delete") {
        openDialog(
          { id: deposit.id, type: action },
          {
            type: "warn",
            desc: t(Notice.REMOVE),
          }
        );
      } else {
        openDialog(
          { id: deposit.id, type: action },
          {
            type: "default",
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
      toast.error("Có lỗi xảy ra khi tải tiền cọc");
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
    isModalOpen,
    setIsModalOpen,
    ConfirmDialog,
  };
};
