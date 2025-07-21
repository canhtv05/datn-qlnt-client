
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  ApiResponse,
  FeedbackFilterValues,
  FeedbackFormValue,
  RoomResponse,
  TenantBasicResponse,
  FeedbackSelfResponse,
} from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useFormErrors, useConfirmDialog } from "@/hooks";
import { createOrUpdateFeedbackSchema } from "@/lib/validation";
import { Status } from "@/enums";

export const useFeedbackTenant = () => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    page = "1",
    size = "15",
    rating = "",
    feedbackType = "",
    feedbackStatus = "",
    query = "",
  } = queryFilter(searchParams, "page", "size", "rating", "feedbackType", "feedbackStatus", "query");

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<FeedbackFilterValues>({
    rating,
    feedbackType,
    feedbackStatus,
    query,
  });

  useEffect(() => {
    setFilterValues({ rating, feedbackType, feedbackStatus, query });
  }, [rating, feedbackType, feedbackStatus, query]);

  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [value, setValue] = useState<FeedbackFormValue>({
    id : "",
    rating: 5,
    feedbackType: null,
    content: "",
    roomId: "",
    tenantId: "",
  });
  const { ConfirmDialog, openDialog } = useConfirmDialog({
  onConfirm: async () => true,
});


  const { errors, clearErrors, handleZodErrors } = useFormErrors<FeedbackFormValue>();
  
  const { data: roomsData } = useQuery<ApiResponse<RoomResponse[]>>({
    queryKey: ["rooms-all"],
    queryFn: async () => (await httpRequest.get("/rooms/all")).data,
  });

  const { data: tenantsData } = useQuery<ApiResponse<TenantBasicResponse[]>>({
    queryKey: ["tenants-all"],
    queryFn: async () => (await httpRequest.get("/tenants/all")).data,
  });

  const {
    data: myFeedbackData,
    isLoading,
    isError,
  } = useQuery<ApiResponse<FeedbackSelfResponse[]>>({
    queryKey: ["feedbacks", "my", page, size, ...Object.values(filterValues)],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: parsedPage.toString(),
        size: parsedSize.toString(),
        ...filterValues,
      };
      return (await httpRequest.get("/feed-backs/my-feedbacks", { params })).data;
    },
    retry: 1,
  });

  useEffect(() => {
    if (isError) toast.error("Lỗi khi tải phản hồi khách thuê");
  }, [isError]);

  const handleClear = () => {
    setFilterValues({ rating: "", feedbackType: "", feedbackStatus: "", query: "" });
    setSearchParams({});
  };

  const handleFilter = () => {
    const params = new URLSearchParams();
    Object.entries(filterValues).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    params.set("page", "1");
    setSearchParams(params);
  };

  const createFeedbackMutation = useMutation({
    mutationFn: async (payload: FeedbackFormValue) =>
      await httpRequest.post("/feed-backs", payload),
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      queryClient.invalidateQueries({
  predicate: (query) =>
    query.queryKey[0] === "feedbacks" && query.queryKey[1] === "my",
});
    },
    onError: () => toast.error("Thêm phản hồi thất bại"),
  });

  const updateFeedbackMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: FeedbackFormValue }) =>
      await httpRequest.put(`/feed-backs/${id}`, payload),
    onSuccess: () => {
      toast.success(Status.UPDATE_SUCCESS);
      queryClient.invalidateQueries({ queryKey: ["feedbacks", "my"] });
    },
    onError: () => toast.error("Cập nhật phản hồi thất bại"),
  });

  const handleChange = <K extends keyof FeedbackFormValue>(key: K, newValue: FeedbackFormValue[K]) => {
    setValue((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleSave = useCallback(async () => {
    try {
      await createOrUpdateFeedbackSchema.parseAsync(value);
      if (value.id) {
        await updateFeedbackMutation.mutateAsync({ id: value.id, payload: value });
      } else {
        await createFeedbackMutation.mutateAsync(value);
      }
      clearErrors();
      setIsModalOpen(false);
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [value, clearErrors, updateFeedbackMutation, createFeedbackMutation, handleZodErrors]);

  const handleActionClick = useCallback(
    (row: FeedbackSelfResponse, type: "update") => {
      setValue({
        id: row.id!,
        tenantId: "",
        roomId: "",
        rating: row.rating,
        content: row.content,
        feedbackType: row.feedbackType,
        feedbackStatus: row.feedbackStatus,
      });
      setIsModalOpen(true);
    },
    []
  );

  return {
    query: { page: parsedPage, size: parsedSize, ...filterValues },
    setSearchParams,
    props: {
      filterValues,
      setFilterValues,
      onClear: handleClear,
      onFilter: handleFilter,
    },
    data: myFeedbackData,
    isLoading,
    rowSelection,
    setRowSelection,
    value,
    setValue,
    errors,
    handleChangeFeedback: handleChange,
    handleSaveFeedback: handleSave,
    handleActionClick,
    isModalOpen,
    setIsModalOpen,
    ConfirmDialog,
    openDialog ,
    roomOptions: roomsData?.data?.map((r) => ({ label: r.roomCode, value: r.id })) || [],
    tenantOptions: tenantsData?.data?.map((t) => ({
      label: `${t.fullName} - ${t.phoneNumber}`,
      value: t.id,
    })) || [],
  };
};
