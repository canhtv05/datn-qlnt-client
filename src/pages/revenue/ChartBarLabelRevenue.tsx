import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useTranslation } from "react-i18next";
import { chartConfig, ChartDataType } from "./ChartAreaRevenue";
import { MonthlyRevenueResponse } from "@/types";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface ChartBarLabelRevenueProp {
  data?: MonthlyRevenueResponse[];
}

export function ChartBarLabelRevenue({ data }: ChartBarLabelRevenueProp) {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();

  const mapChartData = useMemo((): ChartDataType[] => {
    return (
      data?.map((d) => ({
        label: `T${d.month}`,
        value: d.amount || 0,
      })) || []
    );
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle></CardTitle>
        <CardDescription>
          {Array.isArray(data) &&
            data.length >= 2 &&
            `${t("revenue.filter.month")} ${data[0].month} - ${data[data.length - 1].month} - ${
              searchParams.get("year")?.toString() || new Date().getFullYear()
            }`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig(t)}>
          <BarChart
            accessibilityLayer
            data={mapChartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="value" fill="var(--color-primary)" radius={8}>
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
