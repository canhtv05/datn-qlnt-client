import { ApiResponse, MeterInitFilterResponse, MeterReadingMonthlyStatsResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const MeterStatistics = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { roomId } = queryFilter(searchParams, "roomId");

  const { data: meterStatistics, isError: errorMeterStatistics } = useQuery<
    ApiResponse<MeterReadingMonthlyStatsResponse>
  >({
    queryKey: ["meter-statistics"],
    queryFn: async () => {
      const res = await httpRequest.get("/meters/monthly-stats");
      console.log(res.data);
      return res.data;
    },
    retry: 1,
  });

  const { data: filterMeterInit, isError: errorFilterMeterInit } = useQuery<ApiResponse<MeterInitFilterResponse>>({
    queryKey: ["meters-filter-init"],
    queryFn: async () => {
      const res = await httpRequest.get("/meters/init-filter");
      return res.data;
    },
    retry: 1,
  });

  useEffect(() => {
    if (errorMeterStatistics) {
      toast.error("Có lỗi xảy ra khi tải thống kê công tơ");
    }

    if (errorFilterMeterInit) {
      toast.error("Có lỗi xảy ra khi tải thông tin phòng");
    }
  }, [errorFilterMeterInit, errorMeterStatistics]);

  return <div>/finance/meters</div>;
};

export default MeterStatistics;
