
import { FeedbackFilterValues, ApiResponse, FeedbackResponse, FeedbackStatusUpdateRequest } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { handleMutationError } from "@/utils/handleMutationError";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

export const useFeedbackManager = (buildingId?: string) => {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    page = "1",
    size = "15",
    rating = "",
    query = "",
    feedbackType = "",
    feedbackStatus = "",
  } = queryFilter(
    searchParams,
    "page",
    "size",
    "rating",
    "query",
    "feedbackType",
    "feedbackStatus"
  );

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const [filterValues, setFilterValues] = useState<FeedbackFilterValues>({
    rating: rating ? String(rating) : undefined,
    feedbackType,
    feedbackStatus,
    query,
  });

  useEffect(() => {
    setFilterValues({
      rating: rating ? String(rating) : undefined,
      feedbackType,
      feedbackStatus,
      query,
    });
  }, [rating, feedbackType, feedbackStatus, query]);

  const handleClear = () => {
    setFilterValues({
      rating: undefined,
      feedbackType: undefined,
      feedbackStatus: undefined,
      query: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.rating !== undefined) {
      params.set("rating", String(filterValues.rating));
    }
    if (filterValues.feedbackType) {
      params.set("feedbackType", String(filterValues.feedbackType));
    }
    if (filterValues.feedbackStatus) {
      params.set("feedbackStatus", String(filterValues.feedbackStatus));
    }
    if (filterValues.query) {
      params.set("query", filterValues.query);
    }
    params.set("page", "1");
    setSearchParams(params);
  }, [filterValues, setSearchParams]);

  const {
    data: feedbackData,
    isLoading,
    isError,
  } = useQuery<ApiResponse<FeedbackResponse[]>>({
    queryKey: ["feedbacks-manager", parsedPage, parsedSize, buildingId, ...Object.values(filterValues)],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: parsedPage.toString(),
        size: parsedSize.toString(),
      };
      if (buildingId) {
        params["buildingId"] = buildingId;
      }
      if (filterValues.rating !== undefined) {
        params["rating"] = String(filterValues.rating);
      }
      if (filterValues.feedbackType) {
        params["feedbackType"] = String(filterValues.feedbackType);
      }
      if (filterValues.feedbackStatus) {
        params["feedbackStatus"] = String(filterValues.feedbackStatus);
      }
      if (filterValues.query) {
        params["query"] = filterValues.query;
      }

      const res = await httpRequest.get("/feed-backs/find-all", { params });
      return res.data;
    },
  });

  useEffect(() => {
    if (isError) toast.error("Không thể tải danh sách phản hồi.");
  }, [isError]);

  const updateStatusMutation = useMutation({
    mutationKey: ["update-feedback-status"],
    mutationFn: (payload: FeedbackStatusUpdateRequest) =>
      httpRequest.put("/feed-backs/update-status", payload),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công");
      queryClient.invalidateQueries({ queryKey: ["feedbacks-manager"] });
    },
    onError: handleMutationError,
  });

  return {
    data: feedbackData,
    isLoading,
    updateStatus: updateStatusMutation.mutateAsync,
    query: { page: parsedPage, size: parsedSize, ...filterValues },
    props: { filterValues, setFilterValues, onClear: handleClear, onFilter: handleFilter },
  };
};
