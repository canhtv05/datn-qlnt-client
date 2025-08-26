import { Pie, PieChart as Chart } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartDataType } from "@/types";

const fallbackData: ChartDataType[] = [
  {
    label: "Không có dữ liệu",
    count: 1,
    dataKey: "fallback",
    color: "hsl(var(--muted-foreground))",
  },
];

const PieChart = ({ chartData, chartConfig }: { chartData: ChartDataType[]; chartConfig: ChartConfig }) => {
  const validData = chartData.filter((chart) => chart.count > 0);
  const isEmpty = validData.length === 0;
  const finalData = isEmpty ? fallbackData : validData;

  return (
    <Card className="flex flex-col h-full border-none bg-transparent shadow-none">
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="w-full h-[400px] mx-auto">
          <Chart className="flex flex-row">
            <ChartLegend
              content={<ChartLegendContent nameKey="label" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={finalData} dataKey="count" nameKey="label" labelLine={false} />
          </Chart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default PieChart;
