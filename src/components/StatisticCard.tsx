import { LucideIcon } from "lucide-react";
import { useMemo } from "react";

import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";

export interface StatisticCardType {
  value: number;
  label: string;
  icon: LucideIcon;
}

const handleClassGrid = (length: number) => {
  switch (length) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "sm:grid-cols-2 grid-cols-1";
    case 3:
      return "md:grid-cols-3 grid-cols-1";
    case 4:
      return "lg:grid-cols-4 md:grid-cols-2 grid-cols-1";
    case 5:
      return "xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1";
    case 6:
      return "2xl:grid-cols-6 xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1";
    default:
      return "grid-cols-5";
  }
};

const StatisticCard = ({ data }: { data: StatisticCardType[] }) => {
  const length = useMemo(() => data.length, [data.length]);
  const gridCols = handleClassGrid(length);

  return (
    <div className={cn("grid w-full mb-4", gridCols, length > 1 && "gap-4")}>
      {data.map((item, index) => (
        <Card className="border-none rounded-sm py-3 shadow-lg" key={index}>
          <CardContent className="flex justify-between items-center px-4">
            <div className="flex-col flex flex-1">
              <span className="font-black text-[20px] text-foreground">{item.value}</span>
              <span className={cn("text-foreground font-medium text-[14px] truncate max-w-[80%]")}>{item.label}</span>
            </div>
            <div className="p-2 bg-secondary rounded-full">
              <item.icon className="size-5 text-foreground" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatisticCard;
