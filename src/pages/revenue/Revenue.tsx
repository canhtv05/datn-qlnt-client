import { Skeleton } from "@/components/ui/skeleton";
import useRevenue from "./useRevenue";
import RevenueFilter from "./RevenueFilter";
import { ChartAreaRevenue } from "@/pages/revenue/ChartAreaRevenue";
import RenderIf from "@/components/RenderIf";
import RevenueYearFilter from "./RevenueYearFilter";
import useRevenueYear from "./useRevenueYear";
import { ChartBarLabelRevenue } from "./ChartBarLabelRevenue";

const Revenue = () => {
  const { data, isLoading, props } = useRevenue();
  const { data: dataYear, isLoading: isLoadingYear, props: propsYear } = useRevenueYear();

  return (
    <div className="flex flex-col">
      <RevenueFilter props={props} />
      <div className="mt-5 rounded-sm bg-background p-5 place-items-start grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5">
        <RenderIf value={isLoading}>
          {Array.from({ length: 9 }).map((_, idx) => (
            <Skeleton key={idx} className="py-35 shadow-lg w-full" />
          ))}
        </RenderIf>
        <RenderIf value={!isLoading}>
          {Array.isArray(data?.data) && data.data.map((d) => <ChartAreaRevenue key={d.category} data={d} />)}
        </RenderIf>
      </div>
      <div className="flex pt-5 flex-col">
        <RevenueYearFilter props={propsYear} />
        <div className="mt-5 rounded-sm bg-background p-5 gap-5">
          <RenderIf value={isLoadingYear}>
            <Skeleton className="py-35 shadow-lg w-full" />
          </RenderIf>
          <RenderIf value={!isLoadingYear}>
            <ChartBarLabelRevenue data={dataYear?.data.months} />
          </RenderIf>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
