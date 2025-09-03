import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { RevenueComparisonResponse } from "@/types";
import { useMemo } from "react";
import { RevenueCategory } from "@/enums";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp } from "lucide-react";
import { COLOR_CLASS } from "@/constant";

interface ChartAreaRevenueProps {
  data?: RevenueComparisonResponse;
}

interface ChartDataType {
  label: string;
  value?: number;
}

const mapRevenueCategory = (t: TFunction<"translation", undefined>, key?: RevenueCategory) => {
  if (!key) return "";
  return t(`revenueCategory.${RevenueCategory[key]}`);
};

const chartConfig = (t: TFunction<"translation", null>) => {
  return {
    value: {
      label: t("revenueCategory.revenue"),
      color: "var(--color-primary)",
    },
  } satisfies ChartConfig;
};

export function ChartAreaRevenue({ data }: ChartAreaRevenueProps) {
  const { t } = useTranslation();
  const mapChartData = useMemo((): ChartDataType[] => {
    return [
      {
        label: t("revenueCategory.previous"),
        value: data?.previous || 0,
      },
      {
        label: t("revenueCategory.current"),
        value: data?.current || 0,
      },
    ];
  }, [data, t]);

  const chartColor = data?.percent === 0 || data?.percent === -100 ? "hsl(0, 84%, 60%)" : "var(--color-primary)";

  const checkPercent = data?.percent === -100 || data?.percent === 0;
  return (
    <Card className="w-full rounded-md">
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle>{data?.current || 0}</CardTitle>
          <CardDescription>{mapRevenueCategory(t, data?.category)}</CardDescription>
        </div>
        <div>
          <Badge className={checkPercent ? COLOR_CLASS.red : COLOR_CLASS.green}>
            {checkPercent ? <ArrowDown className="stroke-red-500" /> : <ArrowUp className="stroke-primary" />}{" "}
            {data?.percent || 0}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig(t)}>
          <AreaChart
            accessibilityLayer
            data={mapChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area dataKey="value" type="natural" fill={chartColor} fillOpacity={0.4} stroke={chartColor} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
