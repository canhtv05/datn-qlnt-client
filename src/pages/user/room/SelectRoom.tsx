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
import { BedSingle, Building, House, User2, Grid2x2, DollarSign, Tag } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StatusBadge from "@/components/ui/StatusBadge";
import { useTranslation } from "react-i18next";

const styleGridItemWithSidebar = (open: boolean, length: number | undefined) => {
  if (!length) return "grid-cols-1";
  return open
    ? "grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1"
    : "grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1";
};

const SelectRoom = () => {
  const { open } = useSidebar();
  const { t } = useTranslation();
  const { data, isError, isLoading } = useQuery<ApiResponse<RoomResponse[]>>({
    queryKey: ["room-by-tenant"],
    queryFn: async () => {
      const res = await httpRequest.get("/rooms/by-tenant");
      return res.data;
    },
    retry: 1,
  });

  if (isError) toast.error(t("room.errorFetch"));

  return (
    <div
      className={cn(
        "gap-4 mb-4 bg-background p-4 shadow-lg rounded-md transition-all grid",
        styleGridItemWithSidebar(open, data?.data.length)
      )}
      style={{ height: isLoading ? "100%" : "auto" }}
    >
      {/* Skeleton loading */}
      <RenderIf value={isLoading}>
        {Array.from({ length: 10 }).map((_, idx) => (
          <Skeleton key={idx} className="h-36 w-full rounded-md" />
        ))}
      </RenderIf>

      {/* No data */}
      <RenderIf value={!isLoading && (!data?.data || data.data.length === 0)}>
        <div className="grid place-items-center w-full">
          <NoData />
        </div>
      </RenderIf>

      {/* Data rooms */}
      {data?.data.map((d) => (
        <Link to={d.id} key={d.id}>
          <Card className="rounded-sm py-0 border hover:shadow-lg transition-shadow duration-300 cursor-pointer">
            {/* Card Header với logo ở giữa */}
            <CardHeader
              className={cn(
                "p-4 rounded-t-sm relative flex items-center justify-center opacity-95",
                d.status === RoomStatus.DANG_THUE
                  ? "bg-gradient-to-tl from-green-600 via-green-500 to-green-700"
                  : "bg-gradient-to-tl from-yellow-400 via-yellow-500 to-yellow-600"
              )}
            >
              {/* Logo nổi bật ở giữa */}
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                <BedSingle
                  className={`w-6 h-6 ${
                    d.status === RoomStatus.DANG_THUE ? "text-green-600" : "text-yellow-500"
                  }`}
                />
              </div>
            </CardHeader>

            <CardContent className="py-4">
              <div className="flex flex-col gap-2 text-foreground text-sm">
                <span className="flex items-center gap-2 font-bold">
                  <BedSingle className="w-4 h-4 stroke-2" />
                  {t("room.response.roomCode")}:{" "}
                  <span className="ml-1 font-normal">{d.roomCode}</span>
                </span>

                <span className="flex items-center gap-2 font-bold">
                  <Building className="w-4 h-4 stroke-2" />
                  {t("building.response.buildingName")}:{" "}
                  <span className="ml-1 font-normal">{d.floor?.buildingName ?? "-"}</span>
                </span>

                <span className="flex items-center gap-2 font-bold">
                  <House className="w-4 h-4 stroke-2" />
                  {t("room.response.floorName")}:{" "}
                  <span className="ml-1 font-normal">{d.floor?.nameFloor ?? "-"}</span>
                </span>

                <span className="flex items-center gap-2 font-bold">
                  <User2 className="w-4 h-4 stroke-2" />
                  {t("room.response.maximumPeople")}:{" "}
                  <span className="ml-1 font-normal">{d.maximumPeople ?? "-"}</span>
                </span>

                <span className="flex items-center gap-2 font-bold">
                  <Grid2x2 className="w-4 h-4 stroke-2" />
                  Diện tích: <span className="ml-1 font-normal">{d.acreage ?? "-"} m²</span>
                </span>

                <span className="flex items-center gap-2 font-bold">
                  <DollarSign className="w-4 h-4 stroke-2" />
                  {t("room.response.price")}:{" "}
                  <span className="ml-1 font-normal">{formattedCurrency(d.price ?? 0)}</span>
                </span>

                <span className="flex items-center gap-2 font-bold">
                  <Tag className="w-4 h-4 stroke-2" />
                  {t("room.response.roomType")}:{" "}
                  <span className="ml-1 font-normal">
                    {d.roomType ? <StatusBadge status={d.roomType} /> : "-"}
                  </span>
                </span>

                <span className="flex items-center gap-2 font-bold">
                  <Tag className="w-4 h-4 stroke-2" />
                  {t("room.response.status")}:{" "}
                  <span className="ml-1 font-normal">
                    {d.status ? <StatusBadge status={d.status} /> : "-"}
                  </span>
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default SelectRoom;
