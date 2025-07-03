import { Card, CardContent, CardHeader } from "../../ui/card";
import { svg } from "@/assets/svg";
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

const getSvgByBuildingType = (type: BuildingType) => {
  switch (type) {
    case BuildingType.CAN_HO_DICH_VU: {
      return svg.canHoDichVu;
    }
    case BuildingType.CHUNG_CU_MINI: {
      return svg.chungCuMini;
    }
    case BuildingType.NHA_TRO: {
      return svg.nhaTro;
    }
    default: {
      return svg.khac;
    }
  }
};

const SelectBuilding = () => {
  const { data, isError, isLoading } = useQuery<ApiResponse<IBuildingCardsResponse[]>>({
    queryKey: ["buildings-cards"],
    queryFn: async () => {
      const res = await httpRequest.get("/buildings/cards");
      return res.data;
    },
  });

  if (isError) toast.error("Không lấy được dữ liệu tòa nhà");

  return (
    <div
      className={cn(
        "grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mb-4 bg-background p-4 rounded-md",
        !data?.data.length && !isLoading && "md:grid-cols-1 lg:grid-cols-1"
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
        data.data.map((d, index) => (
          <Link to={d.buildingId} key={index}>
            <Card className="rounded-sm py-0 border hover:shadow-lg transition-shadow duration-300 cursor-pointer">
              <CardHeader
                className="p-10 rounded-t-sm relative"
                style={{
                  background:
                    d.status === BuildingStatus.HOAT_DONG ? "var(--color-primary)" : "var(--color-yellow-500)",
                  opacity: 0.8,
                }}
              >
                <div className="absolute inset-0 top-20 flex items-center justify-center">
                  <div
                    className="bg-white rounded-full border-5"
                    style={{
                      borderColor:
                        d.status === BuildingStatus.HOAT_DONG ? "var(--color-primary)" : "var(--color-yellow-500)",
                    }}
                  >
                    <img
                      src={getSvgByBuildingType(d.buildingType)}
                      alt="building icon"
                      className="size-20 rounded-full p-2"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-7">
                <div className="flex flex-col gap-2 text-foreground text-sm">
                  <span className="truncate w-full block font-bold">
                    Tên tòa nhà:
                    <span className="ml-2 font-normal">{d?.buildingName ?? ""}</span>
                  </span>
                  <span className="truncate w-full font-bold flex items-center justify-between">
                    Loại tòa nhà:
                    {d.buildingType ? <StatusBadge status={d?.buildingType} /> : ""}
                  </span>
                  <span className="truncate w-full font-bold flex items-center justify-between">
                    Tổng số phòng:
                    <span className="font-normal">{d?.totalRoom ?? 0}</span>
                  </span>
                  <span className="truncate w-full font-bold flex items-center justify-between">
                    Tổng số phòng trống:
                    <span className="font-normal">{d?.totalRoomAvail ?? 0}</span>
                  </span>
                  <span className="truncate w-full font-bold flex items-center justify-between">
                    Trạng thái:
                    {d.status ? <StatusBadge status={d.status} /> : ""}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
    </div>
  );
};

export default SelectBuilding;
