import useHighestRole from "@/hooks/useHighestRole";
import { ApiResponse, NotificationFilter, NotificationResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function useDashBoard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const highestRole = useHighestRole();

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

      const endpoint = highestRole === "USER" ? "/my-recipient" : "";

      const res = await httpRequest.get(`/notifications${endpoint}`, {
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

  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!observerRef.current) return;

    const el = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && result.hasNextPage && !result.isFetchingNextPage) {
          result.fetchNextPage();
        }
      }
      // { threshold: 1.0 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, [result]);
  const props = {
    onFilter: handleFilter,
    onClear: handleClear,
    filterValues,
    setFilterValues,
  };

  return { result, observerRef, props };
}
