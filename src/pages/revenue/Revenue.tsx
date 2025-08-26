import { Skeleton } from "@/components/ui/skeleton";
import { formattedCurrency } from "@/lib/utils";
import useRevenue from "./useRevenue";
import RevenueFilter from "./RevenueFilter";
import RenderIf from "@/components/RenderIf";
import { RevenueStatisticResponse } from "@/types";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";
import { LabelList, Pie, PieChart } from "recharts";

const Revenue = () => {
  const { data, isLoading, props } = useRevenue();

  const stats: { key: keyof RevenueStatisticResponse; label: string }[] = [
    { key: "expectedRevenue", label: "Doanh thu dự kiến" },
    { key: "currentRevenue", label: "Doanh thu hiện tại" },
    { key: "damageAmount", label: "Thiệt hại" },
    { key: "overdueAmount", label: "Khoản tiền quá hạn" },
    { key: "paidRoomFee", label: "Đã trả tiền phòng" },
    { key: "paidWaterFee", label: "Đã trả phí nước" },
    { key: "paidEnergyFee", label: "Đã trả phí điện" },
    { key: "paidServiceFee", label: "Đã trả phí dịch vụ" },
    { key: "compensationAmount", label: "Tiền bồi thường" },
    { key: "unreturnedDeposit", label: "Tiền cọc lời" },
  ];

  const paidRoomFee = data?.data?.paidRoomFee ?? 0;
  const paidWaterFee = data?.data?.paidWaterFee ?? 0;
  const paidEnergyFee = data?.data?.paidEnergyFee ?? 0;
  const paidServiceFee = data?.data?.paidServiceFee ?? 0;

  const total = paidRoomFee + paidWaterFee + paidEnergyFee + paidServiceFee;

  const chartData = [
    { type: "room", label: "Phòng", value: paidRoomFee, fill: "var(--chart-1)" },
    { type: "water", label: "Nước", value: paidWaterFee, fill: "var(--chart-2)" },
    { type: "energy", label: "Điện", value: paidEnergyFee, fill: "var(--chart-3)" },
    { type: "service", label: "Dịch vụ", value: paidServiceFee, fill: "var(--chart-4)" },
  ];

  const chartConfig = {
    value: { label: "Số tiền" },
    room: { label: "Phòng", color: "var(--chart-1)" },
    water: { label: "Nước", color: "var(--chart-2)" },
    energy: { label: "Điện", color: "var(--chart-3)" },
    service: { label: "Dịch vụ", color: "var(--chart-4)" },
  } satisfies ChartConfig;

  return (
    <div className="flex flex-col">
      <RevenueFilter props={props} />
      <div className="shadow-lg mt-5 bg-background rounded-sm">
        <RenderIf value={isLoading}>
          <Skeleton className="py-40" />
        </RenderIf>

        <RenderIf value={!isLoading && !!data?.data}>
          <div className="p-5 flex flex-col gap-5 md:justify-around md:items-start items-stretch md:flex-row">
            <div className="flex-1 w-full">
              <strong className="block uppercase text-center w-full">Doanh thu tổng quan</strong>
              <div className="flex flex-col gap-y-4 mt-5">
                {stats.map((item) => (
                  <div key={item.key} className="flex justify-between w-full border-b border-border pb-2">
                    <span className="text-sm">{item.label}</span>
                    <strong className="md:!text-[20px] text-sm text-right">
                      {formattedCurrency(Number(data?.data?.[item.key] ?? 0))}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 mt-5 md:mt-0 md:ml-10">
              <strong className="block uppercase text-center w-full">Doanh thu chi tiết</strong>
              <ChartContainer
                config={chartConfig}
                className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
              >
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="value" hideLabel />} />
                  <Pie data={chartData} dataKey="value" nameKey="label">
                    <LabelList dataKey="label" className="fill-background" stroke="none" fontSize={12} />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
          </div>
        </RenderIf>
      </div>
    </div>
  );
};

export default Revenue;
