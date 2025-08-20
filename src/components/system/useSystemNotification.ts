import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiResponse, PaginatedResponse, SystemNotificationResponse, UnreadNotificationCountResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { handleMutationError } from "@/utils/handleMutationError";
import { useEffect } from "react";

export default function useSystemNotification() {
  const queryClient = useQueryClient();
  const { data, isError } = useQuery<ApiResponse<UnreadNotificationCountResponse>>({
    queryKey: ["unread-all"],
    queryFn: async () => {
      const res = await httpRequest.get(`/system-notifications/unread/count`);
      return res.data;
    },
    retry: 1,
  });

  const query = useInfiniteQuery<ApiResponse<PaginatedResponse<SystemNotificationResponse>>>({
    queryKey: ["system-notifications"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await httpRequest.get(`/system-notifications`, {
        params: { page: pageParam, size: 15 },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.data.meta?.pagination;
      if (!pagination) return undefined;

      const { currentPage, totalPages } = pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },

    initialPageParam: 1,
    retry: 1,
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10 && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  };

  const readNotification = useMutation({
    mutationKey: ["read-a-notification"],
    mutationFn: async (id: string) => await httpRequest.patch(`/system-notifications/read/${id}`),
    onError: handleMutationError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unread-all"] });
      queryClient.invalidateQueries({ queryKey: ["system-notifications"] });
    },
  });

  const handleReadNotification = (id: string) => {
    readNotification.mutateAsync(id);
  };

  const readAllNotification = useMutation({
    mutationKey: ["read-a-notification"],
    mutationFn: async () => await httpRequest.patch(`/system-notifications/read-all`),
    onError: handleMutationError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unread-all"] });
      queryClient.invalidateQueries({ queryKey: ["system-notifications"] });
    },
  });

  const handleReadAllNotification = () => {
    readAllNotification.mutateAsync();
  };

  const removeNotification = useMutation({
    mutationKey: ["remove-notification"],
    mutationFn: async (id: string) => await httpRequest.delete(`/system-notifications/${id}`),
    onError: handleMutationError,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unread-all"] });
      queryClient.invalidateQueries({ queryKey: ["system-notifications"] });
    },
  });

  const handleRemoveReadNotification = (id: string) => {
    removeNotification.mutateAsync(id);
  };

  useEffect(() => {
    if (query.isError) {
      toast.error("Có lỗi xảy ra khi tải thông báo hệ thống");
    }

    if (isError) {
      toast.error("Có lỗi xảy ra khi tải số thông báo chưa đọc");
    }
  }, [isError, query.isError]);

  return { query, handleScroll, handleReadNotification, handleReadAllNotification, handleRemoveReadNotification, data };
}
