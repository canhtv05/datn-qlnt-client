import { Card, CardContent, CardHeader } from "../../ui/card";
import StatusBadge from "../../ui/StatusBadge";
import { ApiResponse, IBuildingCardsResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { BuildingStatus, BuildingType } from "@/enums";
import { Link } from "react-router-dom";
import RenderIf from "@/components/RenderIf";
import { Skeleton } from "@/components/ui/skeleton";
import NoData from "@/components/NoData";
import { cn } from "@/lib/utils";
import { Bed, BedDouble, Building2, Castle, CircleDot, Home, Landmark, Layers3, MapPin } from "lucide-react";
import { JSX, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";
import { useTranslation } from "react-i18next";

const getIconByBuildingType = (type: BuildingType, status: BuildingStatus): JSX.Element => {
  const colorClass = status === BuildingStatus.HOAT_DONG ? "text-primary" : "text-yellow-500";

  switch (type) {
    case BuildingType.CAN_HO_DICH_VU:
      return <Building2 size={60} className={`${colorClass} p-2`} />;
    case BuildingType.CHUNG_CU_MINI:
      return <Landmark size={60} className={`${colorClass} p-2`} />;
    case BuildingType.NHA_TRO:
      return <Home size={60} className={`${colorClass} p-2`} />;
    default:
      return <Castle size={60} className={`${colorClass} p-2`} />;
  }
};

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

const SelectBuilding = () => {
  const { t } = useTranslation();
  const { open } = useSidebar();

  const { data, isError, isLoading } = useQuery<ApiResponse<IBuildingCardsResponse[]>>({
    queryKey: ["buildings-cards"],
    queryFn: async () => {
      const res = await httpRequest.get("/buildings/cards");
      return res.data;
    },
    retry: 1,
  });

  useEffect(() => {
    if (isError) toast.error(t("building.errorFetch"));
  }, [isError, t]);

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
                    d.status === BuildingStatus.HOAT_DONG
                      ? "bg-gradient-to-tl from-[#248f55] via-[#38b26d] to-[#1e6f44]"
                      : "bg-gradient-to-tl from-yellow-400 via-yellow-500 to-yellow-600"
                  )}
                >
                  <div className="absolute inset-0 top-20 flex items-center justify-center">
                    <div
                      className="bg-white rounded-full border-5"
                      style={{
                        borderColor:
                          d.status === BuildingStatus.HOAT_DONG ? "var(--color-primary)" : "var(--color-yellow-500)",
                      }}
                    >
                      {getIconByBuildingType(d.buildingType, d.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-7">
                  <div className="flex flex-col gap-2 text-foreground text-sm">
                    <span className="flex items-center gap-2 font-bold">
                      <Building2
                        className={`w-4 h-4 ${d.status === "HOAT_DONG" ? "text-primary" : "text-yellow-500"} stroke-2`}
                      />
                      {t("building.response.buildingName")}:
                      <span className="ml-2 font-normal truncate">{d?.buildingName ?? ""}</span>
                    </span>

                    <span className="flex items-center gap-2 font-bold">
                      <Layers3
                        className={`w-4 h-4 ${d.status === "HOAT_DONG" ? "text-primary" : "text-yellow-500"} stroke-2`}
                      />
                      {t("building.response.buildingType")}:
                      <span className="ml-auto">{d.buildingType ? <StatusBadge status={d?.buildingType} /> : ""}</span>
                    </span>

                    <span className="flex items-center gap-2 font-bold">
                      <BedDouble
                        className={`w-4 h-4 ${d.status === "HOAT_DONG" ? "text-primary" : "text-yellow-500"} stroke-2`}
                      />
                      {t("building.totalRooms")}: <span className="ml-auto font-normal">{d?.totalRoom ?? 0}</span>
                    </span>

                    <span className="flex items-center gap-2 font-bold">
                      <Bed
                        className={`w-4 h-4 ${d.status === "HOAT_DONG" ? "text-primary" : "text-yellow-500"} stroke-2`}
                      />
                      {t("building.roomsAvailable")}:{" "}
                      <span className="ml-auto font-normal">{d?.totalRoomAvail ?? 0}</span>
                    </span>

                    <span className="flex items-center gap-2 font-bold">
                      <CircleDot
                        className={`w-4 h-4 ${d.status === "HOAT_DONG" ? "text-primary" : "text-yellow-500"} stroke-2`}
                      />
                      {t("building.response.status")}:
                      <span className="ml-auto">{d.status ? <StatusBadge status={d.status} /> : ""}</span>
                    </span>
                    <span className="flex items-center gap-2 font-bold">
                      <MapPin
                        className={`w-4 h-4 ${d.status === "HOAT_DONG" ? "text-primary" : "text-yellow-500"} stroke-2`}
                      />
                      {t("building.response.address")}: <span className="ml-auto font-normal">{d.address}</span>
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

export default SelectBuilding;
