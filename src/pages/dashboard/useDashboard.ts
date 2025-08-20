import { ApiResponse, NotificationFilter, NotificationResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function useDashBoard() {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    query = "",
    notificationType = "",
    fromDate = "",
    toDate = "",
  } = queryFilter(searchParams, "query", "notificationType", "fromDate", "toDate");

  const [filterValues, setFilterValues] = useState<NotificationFilter>({
    fromDate,
    notificationType,
    query,
    toDate,
  });

  const handleClear = () => {
    setFilterValues({
      fromDate: "",
      notificationType: "",
      query: "",
      toDate: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filterValues).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  }, [filterValues, setSearchParams]);

  const result = useInfiniteQuery<ApiResponse<NotificationResponse[]>>({
    queryKey: ["notifications", query, fromDate, toDate, notificationType],
    queryFn: async ({ pageParam = 1 }) => {
      const params: Record<string, string> = {};
      Object.entries(filterValues).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const res = await httpRequest.get(`/notifications`, {
        params: { page: pageParam, size: 15, ...filterValues },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.meta?.pagination;
      if (!pagination) return undefined;

      const { currentPage, totalPages } = pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },

    initialPageParam: 1,
    retry: 1,
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10 && result.hasNextPage && !result.isFetchingNextPage) {
      result.fetchNextPage();
    }
  };

  const props = {
    onFilter: handleFilter,
    onClear: handleClear,
    filterValues,
    setFilterValues,
  };

  return { result, handleScroll, props };
}
