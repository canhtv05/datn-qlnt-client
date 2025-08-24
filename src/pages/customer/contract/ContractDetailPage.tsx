import { Link, useParams } from "react-router-dom";
import {
  AssetLittleResponse,
  ContractDetailResponse,
  ServiceLittleResponse,
  TenantLittleResponse,
  VehicleBasicResponse,
} from "@/types";
import { httpRequest } from "@/utils/httpRequest";

import "@/assets/css/print.css";
import "ckeditor5/ckeditor5.css";
import { useQuery } from "@tanstack/react-query";
import {
  assetBelongToEnumToString,
  assetStatusEnumToString,
  contractStatusEnumToString,
  formatDate,
  formattedCurrency,
  genderEnumToString,
  serviceRoomStatusEnumToString,
  vehicleTypeEnumToString,
} from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useAuthStore } from "@/zustand/authStore";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Tooltip from "@/components/ToolTip";
import RenderIf from "@/components/RenderIf";
import { Skeleton } from "@/components/ui/skeleton";

const ContractDetailPage = () => {
  const { contractId } = useParams();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery<ContractDetailResponse>({
    queryKey: ["contract-detail", contractId],
    queryFn: async () => (await httpRequest.get(`/contracts/${contractId}`)).data.data,
    enabled: !!contractId,
    retry: 1,
  });

  const { user } = useAuthStore((s) => s);

  return (
    <div>
      <RenderIf value={isLoading}>
        <div className="bg-background p-5 rounded-md space-y-5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <Skeleton
              style={{
                background: "var(--color-input)",
              }}
              key={idx}
              className="py-12"
            />
          ))}
        </div>
      </RenderIf>
      <RenderIf value={!isLoading}>
        <div className="p-6 space-y-6 bg-background rounded-md">
          <div className="bg-input shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin hợp đồng</h2>
            <div className="grid grid-cols-2 text-sm">
              <p>
                <span className="font-medium">Mã hợp đồng:</span> {data?.contractCode}
              </p>
              <p>
                <span className="font-medium">Phòng:</span> {data?.roomCode}
              </p>
              <p>
                <span className="font-medium">Ngày bắt đầu:</span> {data?.startDate ? formatDate(data?.startDate) : ""}
              </p>
              <p>
                <span className="font-medium">Ngày kết thúc:</span> {data?.endDate ? formatDate(data?.endDate) : ""}
              </p>
              <p>
                <span className="font-medium">Tiền cọc:</span> {formattedCurrency(data?.deposit || 0)}
              </p>
              <p>
                <span className="font-medium">Giá phòng:</span> {formattedCurrency(data?.roomPrice || 0)}
              </p>
              <p>
                <span className="font-medium">Địa chỉ toà nhà:</span> {data?.buildingAddress}
              </p>
              <p>
                <span className="font-medium">Trạng thái:</span>{" "}
                {data?.status ? contractStatusEnumToString(data.status, t) : ""}
              </p>
              <p>
                <span className="font-medium">Giá điện:</span> {formattedCurrency(data?.electricPrice || 0)}
              </p>
              <p>
                <span className="font-medium">Giá nước:</span> {formattedCurrency(data?.waterPrice || 0)}
              </p>
            </div>
          </div>

          <div className="bg-input shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin quản lý & khách thuê chính</h2>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4 text-sm">
              <div>
                <p>
                  <span className="font-medium">Quản lý:</span> {data?.nameManager} ({data?.phoneNumberManager})
                </p>
                <p>
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <p>
                  <span className="font-medium">SĐT:</span> {user?.phoneNumber}
                </p>
              </div>
              <div>
                <p>
                  <span className="font-medium">Khách thuê chính:</span> {data?.nameUser}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {data?.emailUser}
                </p>
                <p>
                  <span className="font-medium">CMND/CCCD:</span> {data?.identityCardUser}
                </p>
                <p>
                  <span className="font-medium">Địa chỉ:</span> {data?.addressUser}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-input shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Khách thuê</h2>
            <ul className="space-y-2 text-sm">
              {data?.tenants?.map((tn: TenantLittleResponse, i: number) => (
                <li key={i} className="border-background border p-3 rounded-lg">
                  <p>
                    <span className="font-medium">Họ tên:</span> {tn.fullName}
                  </p>
                  <p>
                    <span className="font-medium">Giới tính:</span> {genderEnumToString(tn.gender, t)}
                  </p>
                  <p>
                    <span className="font-medium">SĐT:</span> {tn.phoneNumber}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {tn.email}
                  </p>
                  {tn.representative && <span className="text-green-600 font-semibold">Người đại diện</span>}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-input shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Tài sản</h2>
            <ul className="space-y-2 text-sm">
              {data?.assets?.map((a: AssetLittleResponse, i: number) => (
                <li key={i} className="border-background border p-3 rounded-lg">
                  <p>
                    <span className="font-medium">Tên:</span> {a.assetName}
                  </p>
                  <p>
                    <span className="font-medium">Tài sản thuộc về:</span>{" "}
                    {assetBelongToEnumToString(a.assetBeLongTo, t)}
                  </p>
                  <p>
                    <span className="font-medium">Số lượng:</span> {a.quantity}
                  </p>
                  <p>
                    <span className="font-medium">Giá:</span> {formattedCurrency(a.price || 0)}
                  </p>
                  <p>
                    <span className="font-medium">Trạng thái:</span> {assetStatusEnumToString(a.assetStatus, t)}
                  </p>
                  <p>
                    <span className="font-medium">Mô tả:</span> {a.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-input shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Dịch vụ</h2>
            <ul className="space-y-2 text-sm">
              {data?.services?.map((s: ServiceLittleResponse, i: number) => (
                <li key={i} className="border-background border p-3 rounded-lg">
                  <p>
                    <span className="font-medium">Tên:</span> {s.serviceName}
                  </p>
                  <p>
                    <span className="font-medium">Đơn giá:</span> {formattedCurrency(s.unitPrice || 0)}/{s.unit}
                  </p>
                  <p>
                    <span className="font-medium">Trạng thái:</span>{" "}
                    {serviceRoomStatusEnumToString(s.serviceRoomStatus, t)}
                  </p>
                  <p>
                    <span className="font-medium">Mô tả:</span> {s.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-input shadow rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4">Phương tiện</h2>
            <ul className="space-y-2 text-sm">
              {data?.vehicles?.map((v: VehicleBasicResponse, i: number) => (
                <li key={i} className="border-background border p-3 rounded-lg">
                  <p>
                    <span className="font-medium">Chủ xe:</span> {v.tenantName}
                  </p>
                  <p>
                    <span className="font-medium">Loại xe:</span> {vehicleTypeEnumToString(v.vehicleType, t)}
                  </p>
                  <p>
                    <span className="font-medium">Biển số:</span> {v.licensePlate}
                  </p>
                  <p>
                    <span className="font-medium">Mô tả:</span> {v.description}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex md:flex-row flex-col items-center justify-between">
            <div className="text-xs text-gray-500 text-right">
              <p>Ngày tạo: {data?.createdAt ? formatDate(data?.createdAt) : ""}</p>
              <p>Cập nhật: {data?.updatedAt ? formatDate(data?.updatedAt) : ""}</p>
            </div>
            <Tooltip content="Xem nội dung">
              <Link to={`/customers/contracts/content/${contractId}`}>
                <Button size={"icon"}>
                  <Eye className="stroke-white" />
                </Button>
              </Link>
            </Tooltip>
          </div>
        </div>
      </RenderIf>
    </div>
  );
};

export default ContractDetailPage;
