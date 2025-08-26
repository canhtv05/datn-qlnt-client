import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { httpRequest } from "@/utils/httpRequest";
import { ApiResponse, VehicleResponse } from "@/types";
import { Car, Bike, Truck, FileText } from "lucide-react";
import { VehicleStatus } from "@/enums";

const NA = "N/A";

const vehicleStatusColorMap: Record<VehicleStatus, string> = {
  SU_DUNG: "bg-green-500 text-white",
  KHONG_SU_DUNG: "bg-yellow-400 text-gray-900",
  TAM_KHOA: "bg-red-500 text-white",
};
const vehicleStatusLabelMap: Record<VehicleStatus, string> = {
  SU_DUNG: "Đang sử dụng",
  KHONG_SU_DUNG: "Tạm dừng",
  TAM_KHOA: "Tạm khóa",
};

const vehicleTypeToString = (type: string) => {
  switch (type) {
    case "XE_MAY":
      return "Xe máy";
    case "O_TO":
      return "Ô tô";
    case "XE_DAP":
      return "Xe đạp";
    case "KHAC":
      return "Khác";
    default:
      return "N/A";
  }
};

const vehicleTypeToIcon = (type: string) => {
  switch (type) {
    case "XE_MAY":
      return <Bike className="w-6 h-6 text-gray-700 dark:text-gray-200" />;
    case "O_TO":
      return <Car className="w-6 h-6 text-gray-700 dark:text-gray-200" />;
    case "XE_DAP":
      return <Bike className="w-6 h-6 text-gray-700 dark:text-gray-200" />;
    case "KHAC":
    default:
      return <Truck className="w-6 h-6 text-gray-700 dark:text-gray-200" />;
  }
};

const VehicleCards = () => {
  const { id: roomId } = useParams<{ id: string }>();
  const { data, isError, isLoading } = useQuery<ApiResponse<VehicleResponse[]>>({
    queryKey: ["room-vehicles-detail", roomId],
    queryFn: async () => {
      const res = await httpRequest.get(`/vehicles/${roomId}`);
      return res.data;
    },
    enabled: !!roomId,
    retry: 1,
  });

  useEffect(() => {
    if (isError) toast.error("Không thể tải phương tiện. Vui lòng thử lại sau.");
  }, [isError]);

  const vehicles = data?.data ?? [];

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return NA;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? NA : date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="bg-background rounded-md w-full p-6">
      {/* Tiêu đề trang */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Car className="w-8 h-8 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Danh sách phương tiện</h2>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-48 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-10 text-gray-500 text-lg">Chưa có phương tiện nào</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-gradient-to-tr from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-md rounded-xl p-5 hover:shadow-xl transition cursor-pointer flex flex-col gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  {vehicleTypeToIcon(vehicle.vehicleType)}
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900 dark:text-gray-100">{vehicle.fullName || NA}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    Loại: {vehicleTypeToString(vehicle.vehicleType)}
                  </span>
                </div>
                <span
                  className={`ml-auto inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    vehicleStatusColorMap[vehicle.vehicleStatus] || "bg-gray-400 text-white"
                  }`}
                >
                  {vehicleStatusLabelMap[vehicle.vehicleStatus] || NA}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-300">
                <span>Biển số: {vehicle.licensePlate || NA}</span>
                <span>Ngày đăng ký: {formatDate(vehicle.registrationDate)}</span>
                {vehicle.describe && (
                  <p className="flex items-start gap-1 text-gray-600 dark:text-gray-400">
                    <FileText className="w-4 h-4 mt-[2px]" />
                    {vehicle.describe}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default VehicleCards;
