import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpRequest } from "@/utils/httpRequest";

import { ApiResponse, AssetRoomDetailResponse, AssetLittleResponse } from "@/types";
import { Tag, DollarSign, FileText } from "lucide-react";
import { assetStatusToString, formattedCurrency } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const NA = "N/A";

const statusColorMap: Record<string, string> = {
  HOAT_DONG: "bg-green-500",
  HU_HONG: "bg-red-500",
  CAN_BAO_TRI: "bg-yellow-400 text-gray-900",
  THAT_LAC: "bg-orange-400",
  DA_THANH_LY: "bg-gray-500",
  KHONG_SU_DUNG: "bg-gray-300 text-gray-800",
  HUY: "bg-black text-white",
};

const RoomAssets = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { data, isError, isLoading } = useQuery<ApiResponse<AssetRoomDetailResponse>>({
    queryKey: ["room-assets-detail", id],
    queryFn: async () => {
      const res = await httpRequest.get(`/asset-rooms/${id}`);
      return res.data;
    },
    enabled: !!id,
    retry: 1,
  });

  useEffect(() => {
    if (isError) {
      toast.error(t("roomAsset.errorFetch"));
    }
  }, [isError, t]);

  const room = data?.data;

  return (
    <div className="bg-background rounded-md w-full p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">
          {t("roomAsset.title")}: {room?.roomCode || NA}
        </h3>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-40 w-full bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !room?.assets || room.assets.length === 0 ? (
        <div className="text-center py-10 text-gray-500"> {t("roomAsset.errorNoAssets")}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {room.assets.map((asset: AssetLittleResponse) => (
            <div
              key={asset.id}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
            >
              <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100">
                {asset.assetName || NA}
              </h4>

              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                <Tag className="w-4 h-4" />
                <span>{asset.assetBeLongTo || NA}</span>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                <DollarSign className="w-4 h-4" />
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {formattedCurrency(asset.price ?? 0)}
                </span>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                {t("roomAsset.addOrUpdate.quantity")}{" "}
                <span className="font-medium">{asset.quantity || 1}</span>
              </div>

              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
                  statusColorMap[asset.assetStatus] || "bg-gray-400"
                }`}
              >
                {assetStatusToString(asset.assetStatus) || NA}
              </span>

              {asset.description && (
                <p className="flex items-start gap-1 text-sm text-gray-700 dark:text-gray-300 mt-1">
                  <FileText className="w-4 h-4 mt-[2px]" />
                  {asset.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomAssets;
