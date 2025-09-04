import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpRequest } from "@/utils/httpRequest";

import { ApiResponse, ServiceRoomDetailResponse, ServiceLittleResponse } from "@/types";
import { DollarSign, FileText } from "lucide-react";
import { formattedCurrency } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const NA = "N/A";

const serviceStatusColorMap: Record<string, string> = {
  DANG_SU_DUNG: "bg-green-500 text-white",
  TAM_DUNG: "bg-yellow-400 text-gray-900",
};

const RoomServices = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const { data, isError, isLoading } = useQuery<ApiResponse<ServiceRoomDetailResponse>>({
    queryKey: ["room-services-detail", id],
    queryFn: async () => {
      const res = await httpRequest.get(`/service-rooms/${id}`);
      return res.data;
    },
    enabled: !!id,
    retry: 1,
  });

  useEffect(() => {
    if (isError) {
      toast.error(t("roomServices.loadError"));
    }
  }, [isError, t]);

  const room = data?.data;

  const groupedServices = useMemo(() => {
    const groups: Record<string, ServiceLittleResponse[]> = {
      DANG_SU_DUNG: [],
      TAM_DUNG: [],
    };
    room?.services.forEach((s) => {
      if (groups[s.serviceRoomStatus]) {
        groups[s.serviceRoomStatus].push(s);
      }
    });
    return groups;
  }, [room]);

  return (
    <div className="bg-background rounded-md w-full p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">
          {t("roomServices.title")}: {room?.roomCode || NA}
        </h3>
      </div>

      {isLoading ? (
        <div className="flex gap-4">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="flex-1 min-w-[250px] bg-gray-200 rounded-xl animate-pulse h-40" />
          ))}
        </div>
      ) : !room?.services || room.services.length === 0 ? (
        <div className="text-center py-10 text-gray-500">{t("roomServices.empty")}</div>
      ) : (
        <div className="flex gap-4 overflow-x-auto">
          {Object.entries(t("roomServices.status", { returnObjects: true }) as Record<string, string>).map(
            ([statusKey, label]) => (
              <div
                key={statusKey}
                className="flex-1 min-w-[280px] bg-gray-100 dark:bg-gray-800 rounded-lg p-3 flex flex-col gap-3"
              >
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">{label}</h4>

                {groupedServices[statusKey].length === 0 ? (
                  <div className="text-gray-500 text-sm">{t("roomServices.noService")}</div>
                ) : (
                  groupedServices[statusKey].map((service) => (
                    <div
                      key={service.id}
                      className="p-3 rounded-lg shadow-sm hover:shadow-md transition bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 flex flex-col gap-2"
                    >
                      <span className="font-bold text-gray-900 dark:text-gray-100">{service.serviceName || NA}</span>
                      <div className="flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">
                          {formattedCurrency(service.unitPrice)} / {service.unit || NA}
                        </span>
                      </div>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold w-fit ${
                          serviceStatusColorMap[service.serviceRoomStatus] || "bg-gray-400 text-white"
                        }`}
                      >
                        {t(`roomServices.status.${service.serviceRoomStatus}`)}
                      </span>
                      {service.description && (
                        <p className="flex items-start gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <FileText className="w-4 h-4 mt-[2px]" />
                          {service.description}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default RoomServices;
