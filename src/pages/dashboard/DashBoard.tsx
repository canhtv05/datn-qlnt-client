import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import useDashBoard from "./useDashboard";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import StatusBadge from "@/components/ui/StatusBadge";
import NoData from "@/components/NoData";
import RenderIf from "@/components/RenderIf";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "@/components/Image";
import DashBoardFilter from "./DashBoardFilter";

const DashBoard = () => {
  const { result, handleScroll, props } = useDashBoard();

  return (
    <div className="h-[79vh] flex flex-col lg:flex-row-reverse w-full mx-auto overflow-y-auto" onScroll={handleScroll}>
      <div className="lg:w-[35%] w-full lg:ml-2 lg:mb-0 mb-5">
        <DashBoardFilter props={props} />
      </div>
      <div className="flex-1 overflow-y-auto space-y-5">
        {result.isError ||
          (result.data?.pages[0].data.length === 0 && (
            <div className="bg-background rounded-md h-full flex items-center justify-center">
              <NoData />
            </div>
          ))}
        <RenderIf value={result.isLoading}>
          {Array.from({ length: 10 }).map((_, idx) => (
            <Skeleton key={idx} className="py-50" />
          ))}
        </RenderIf>
        {result.data?.pages.flatMap((page) =>
          page.data.map((item) => (
            <Card key={item.id} className="shadow-none rounded-md">
              <CardHeader className="flex flex-row items-center gap-3 px-4 py-2">
                <Image src={item.senderImage} alt={item.fullName} />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">
                    Gửi bởi {item.fullName} • {format(new Date(item.sentAt), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </p>
                  <StatusBadge status={item.notificationType} />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <CardTitle className="text-base font-semibold">{item.title}</CardTitle>
                <p className="text-sm text-foreground">{item.content}</p>

                {item.image && (
                  <div className="w-full">
                    <img src={item.image} alt="notification" className="w-full rounded-lg border object-cover" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}

        {result.isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
          </div>
        )}
        {!result.isLoading && result.data?.pages.some((page) => page.data.length > 0) && !result.hasNextPage && (
          <p className="text-center text-muted-foreground text-sm py-4">Không còn thông báo nào</p>
        )}
      </div>
    </div>
  );
};

export default DashBoard;
