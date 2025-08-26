import { useConfirmDialog } from "@/hooks";
import { ApiResponse, DepositDetailView, DepositFilter } from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useDeposit = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
    queryKey: ["my-deposits", page, size, query, depositStatus],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (query) params["query"] = query;
      if (depositStatus) params["depositStatus"] = depositStatus;

      const res = await httpRequest.get("/deposits/tenant", {
        params,
      });

      return res.data;
    },
    retry: 1,
  });

  const confirmReceiptDepositMutation = useMutation({
    mutationKey: ["confirm-receipt-deposit"],
    mutationFn: async (id: string) => await httpRequest.post(`/deposits/confirm-receipt/${id}`),
  });

  const notReceiptDepositMutation = useMutation({
    mutationKey: ["not-receipt-deposit"],
    mutationFn: async (id: string) => await httpRequest.post(`/deposits/not-received/${id}`),
  });

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "deposit2" | "deposit3" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "deposit2") return await handleConfirmDepositById(id);
      else handleNotReceivedDepositById(id);
      return false;
    },
  });

  const handleConfirmDepositById = async (id: string): Promise<boolean> => {
    try {
      await confirmReceiptDepositMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "my-deposits",
          });
          // queryClient.invalidateQueries({ queryKey: ["meter-statistics"] });
          toast.success("Gửi thông báo xác nhận đã nhận đủ cọc tới chủ nhà thành công");
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleNotReceivedDepositById = async (id: string): Promise<boolean> => {
    try {
      await notReceiptDepositMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "my-deposits",
          });
          // queryClient.invalidateQueries({ queryKey: ["meter-statistics"] });
          toast.success("Gửi thông báo chưa nhận đủ cọc tới chủ nhà thành công");
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleActionClick = useCallback(
    (deposit: DepositDetailView, action: "deposit3" | "deposit2") => {
      idRef.current = deposit.id;
      openDialog(
        { id: deposit.id, type: action },
        {
          type: "warn",
        }
      );
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
