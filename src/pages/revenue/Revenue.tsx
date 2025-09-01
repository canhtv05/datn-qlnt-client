import { Skeleton } from "@/components/ui/skeleton";
import { buildRevenueStatistical, chartData, formattedCurrency } from "@/lib/utils";
import useRevenue from "./useRevenue";
import RevenueFilter from "./RevenueFilter";
import RenderIf from "@/components/RenderIf";
import { RevenueStatisticResponse } from "@/types";
import { ChartConfig } from "@/components/ui/chart";
import PieChart from "@/components/PieChart";
import { useTranslation } from "react-i18next";

const Revenue = () => {
  const { t } = useTranslation();
  const { data, isLoading, props } = useRevenue();

  const stats: { key: keyof RevenueStatisticResponse; label: string }[] = [
    { key: "expectedRevenue", label: t("revenue.response.expectedRevenue") },
    { key: "currentRevenue", label: t("revenue.response.currentRevenue") },
    { key: "damageAmount", label: t("revenue.response.damageAmount") },
    { key: "overdueAmount", label: t("revenue.response.overdueAmount") },
    { key: "paidRoomFee", label: t("revenue.response.paidRoomFee") },
    { key: "paidWaterFee", label: t("revenue.response.paidWaterFee") },
    { key: "paidEnergyFee", label: t("revenue.response.paidEnergyFee") },
    { key: "paidServiceFee", label: t("revenue.response.paidServiceFee") },
    { key: "compensationAmount", label: t("revenue.response.compensationAmount") },
    { key: "unreturnedDeposit", label: t("revenue.response.unreturnedDeposit") },
  ];

  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    chrome: {
      label: "Chrome",
      color: "var(--chart-1)",
    },
    safari: {
      label: "Safari",
      color: "var(--chart-2)",
    },
    firefox: {
      label: "Firefox",
      color: "var(--chart-3)",
    },
    edge: {
      label: "Edge",
      color: "var(--chart-4)",
    },
    other: {
      label: "Other",
      color: "var(--chart-5)",
    },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col">
      <RevenueFilter props={props} />
      <div className="shadow-lg mt-5 bg-background rounded-sm">
        <RenderIf value={isLoading}>
          <Skeleton className="py-40" />
        </RenderIf>

        <RenderIf value={!isLoading && !!data?.data}>
          <div className="p-5 flex flex-col h-full gap-5 md:justify-around md:items-start items-stretch md:flex-row">
            <div className="flex-1 w-full">
              <strong className="block uppercase text-center w-full">
                {t("revenue.title.overview")}
              </strong>
              <div className="flex flex-col gap-y-4 mt-5">
                {stats.map((item) => (
                  <div
                    key={item.key}
                    className="flex justify-between w-full border-b border-border pb-2"
                  >
                    <span className="text-sm">{item.label}</span>
                    <strong className="md:!text-[20px] text-sm text-right">
                      {formattedCurrency(Number(data?.data?.[item.key] ?? 0))}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-between h-full mt-5 md:mt-0 md:ml-10">
              <strong className="block uppercase text-center w-full">
                {t("revenue.title.detail")}
              </strong>
              <PieChart
                chartData={chartData(buildRevenueStatistical(data?.data))}
                chartConfig={chartConfig}
              />
            </div>
          </div>
        </RenderIf>
      </div>
    </div>
  );
};

export default Revenue;
