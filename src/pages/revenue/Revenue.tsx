import { Skeleton } from "@/components/ui/skeleton";
import useRevenue from "./useRevenue";
import RevenueFilter from "./RevenueFilter";
import { ChartAreaRevenue } from "@/pages/revenue/ChartAreaRevenue";
import RenderIf from "@/components/RenderIf";

const Revenue = () => {
  const { data, isLoading, props } = useRevenue();

  return (
    <div className="flex flex-col">
      <RevenueFilter props={props} />
      <div className="mt-5 rounded-sm place-items-start grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
        <RenderIf value={isLoading}>
          {Array.from({ length: 9 }).map((_, idx) => (
            <Skeleton key={idx} className="py-35 shadow-lg w-full" />
          ))}
        </RenderIf>
        <RenderIf value={!isLoading}>
          {Array.isArray(data?.data) && data.data.map((d) => <ChartAreaRevenue key={d.category} data={d} />)}
        </RenderIf>
      </div>
    </div>
  );
};

export default Revenue;
