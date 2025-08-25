import { ApiResponse, RoomResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { RoomStatus } from "@/enums";
import { Link } from "react-router-dom";
import RenderIf from "@/components/RenderIf";
import { Skeleton } from "@/components/ui/skeleton";
import NoData from "@/components/NoData";
import { cn, formattedCurrency } from "@/lib/utils";
import { BedSingle, Building, DollarSign, Grid2x2, House, User2 } from "lucide-react";
import { useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";

const styleGridItemWithSidebar = (open: boolean, length: number | undefined) => {
  if (!length) {
    return "grid-cols-1";
  }
  if (open) {
    return "grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1";
  } else {
    return "grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1";
  }
};

const SelectRoom = () => {
  const { open } = useSidebar();

  const { data, isError, isLoading } = useQuery<ApiResponse<RoomResponse[]>>({
    queryKey: ["room-by-tenant"],
    queryFn: async () => {
      const res = await httpRequest.get("/rooms/by-tenant");
      return res.data;
    },
    retry: 1,
  });

  useEffect(() => {
    if (isError) toast.error("Không lấy được dữ liệu phòng");
  }, [isError]);

  return (
    <div
      className={cn(
        "gap-4 mb-4 bg-background p-4 shadow-lg rounded-md transition-all",
        !data?.data.length && !isLoading && "md:grid-cols-1 lg:grid-cols-1",
        styleGridItemWithSidebar(open, data?.data.length)
      )}
      style={{
        height: isLoading ? "100%" : "auto",
      }}
    >
      <RenderIf value={!isLoading && !data?.data.length}>
        <div className="grid place-items-center w-full">
          <NoData />
        </div>
      </RenderIf>
      <RenderIf value={isLoading}>
        {Array.from({ length: 10 }).map((_, idx) => (
          <Skeleton key={idx} className="py-37" />
        ))}
      </RenderIf>
      {data &&
        data.data.length > 0 &&
        data.data.map((d, index) => {
          return (
            <Link to={d.id} key={index}>
              <Card className="rounded-sm py-0 border hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <CardHeader
                  className={cn(
                    "p-10 rounded-t-sm relative opacity-95",
                    d.status === RoomStatus.DANG_THUE
                      ? "bg-gradient-to-tl from-[#248f55] via-[#38b26d] to-[#1e6f44]"
                      : "bg-gradient-to-tl from-yellow-400 via-yellow-500 to-yellow-600"
                  )}
                >
                  <div className="absolute inset-0 top-20 flex items-center justify-center">
                    <div
                      className="bg-white rounded-full"
                      style={{
                        borderColor:
                          d.status === RoomStatus.DANG_THUE ? "var(--color-primary)" : "var(--color-yellow-500)",
                      }}
                    ></div>
                  </div>
                </CardHeader>
                <CardContent className="py-7">
                  <div className="flex flex-col gap-2 text-foreground text-sm">
                    <span className="flex items-center gap-2 font-bold">
                      <BedSingle
                        className={`w-4 h-4 ${
                          d.status === RoomStatus.DANG_THUE ? "text-primary" : "text-yellow-500"
                        } stroke-2`}
                      />
                      Mã phòng:
                      <span className="ml-2 font-normal truncate">{d?.roomCode ?? ""}</span>
                    </span>

                    <span className="flex items-center gap-2 font-bold">
                      <Building
                        className={`w-4 h-4 ${
                          d.status === RoomStatus.DANG_THUE ? "text-primary" : "text-yellow-500"
                        } stroke-2`}
                      />
                      Tên tòa nhà: <span className="ml-2 font-normal truncate">{d?.floor.buildingName ?? ""}</span>
                    </span>

                    <span className="flex items-center gap-2 font-bold">
                      <House
                        className={`w-4 h-4 ${
                          d.status === RoomStatus.DANG_THUE ? "text-primary" : "text-yellow-500"
                        } stroke-2`}
                      />
                      Tên tầng: <span className="ml-2 font-normal truncate">{d?.floor.nameFloor ?? ""}</span>
                    </span>

                    <span className="flex items-center gap-2 font-bold">
                      <User2
                        className={`w-4 h-4 ${
                          d.status === RoomStatus.DANG_THUE ? "text-primary" : "text-yellow-500"
                        } stroke-2`}
                      />
                      Số người tối đa: <span className="ml-2 font-normal truncate">{d?.maximumPeople ?? ""}</span>
                    </span>

                    <span className="flex items-center gap-2 font-bold">
                      <Grid2x2
                        className={`w-4 h-4 ${
                          d.status === RoomStatus.DANG_THUE ? "text-primary" : "text-yellow-500"
                        } stroke-2`}
                      />
                      Diện tích: <span className="ml-2 font-normal truncate">{d?.acreage ?? ""}m²</span>
                    </span>

                    <span className="flex items-center gap-2 font-bold">
                      <DollarSign
                        className={`w-4 h-4 ${
                          d.status === RoomStatus.DANG_THUE ? "text-primary" : "text-yellow-500"
                        } stroke-2`}
                      />
                      Giá phòng:{" "}
                      <span className="ml-2 font-normal truncate">{formattedCurrency(d?.acreage ?? 0) ?? ""}</span>
                    </span>

                    <span className="flex items-center gap-2 font-bold">
                      <DollarSign
                        className={`w-4 h-4 ${
                          d.status === RoomStatus.DANG_THUE ? "text-primary" : "text-yellow-500"
                        } stroke-2`}
                      />
                      Loại phòng:{" "}
                      <span className="ml-2 font-normal truncate">
                        {d.roomType ? <StatusBadge status={d.roomType} /> : "Không xác định"}
                      </span>
                    </span>

                    <span className="flex items-center gap-2 font-bold">
                      <DollarSign
                        className={`w-4 h-4 ${
                          d.status === RoomStatus.DANG_THUE ? "text-primary" : "text-yellow-500"
                        } stroke-2`}
                      />
                      Trạng thái:{" "}
                      <span className="ml-2 font-normal truncate">
                        {d.status ? <StatusBadge status={d.status} /> : "Không xác định"}
                      </span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
    </div>
  );
};

export default SelectRoom;
