import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { httpRequest } from "@/utils/httpRequest";
import { toast } from "sonner";
import { ApiResponse, TenantDetailResponse } from "@/types";
import { Building2, FileSignature, Mail, UserRound, X, FileText } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";

const formatDate = (date: Date) => date.toLocaleDateString("vi-VN");
const formatDateTime = (date: Date) => date.toLocaleString("vi-VN");

const DetailTenant = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isError } = useQuery<ApiResponse<TenantDetailResponse>>({
    queryKey: ["tenantDetail", id],
    queryFn: async () => {
      const res = await httpRequest.get(`/tenants/detail/${id}`);
      return res.data;
    },
    enabled: !!id,
    retry: 1,
  });

  const tenant = data?.data;

  if (isError) {
    toast.error("Không thể tải thông tin khách thuê. Vui lòng thử lại sau.");
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex justify-center items-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) navigate(-1);
      }}
    >
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl max-h-[95vh] flex flex-col overflow-hidden">
        <div className="bg-primary/80 p-6 relative shrink-0">
          <Button
            size="icon"
            variant="ghost"
            className="absolute cursor-pointer right-4 top-4 bg-white/20 text-white hover:bg-white/30 rounded-full"
            onClick={() => navigate(-1)}
          >
            <X className="w-5 h-5 stroke-white" />
          </Button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">{tenant?.fullName}</h1>
              <div className="flex flex-wrap gap-2 mt-1 text-xs text-white">
                <span className="flex items-center gap-1">
                  Trạng thái: {tenant?.tenantStatus && <StatusBadge status={tenant.tenantStatus} />}
                </span>
                {tenant?.isRepresentative && (
                  <span className="flex items-center gap-1">
                    Là đại diện:{" "}
                    <StatusBadge
                      status={tenant.isRepresentative ? "isRepresentative=true" : "isRepresentative=false"}
                    />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 overflow-y-auto grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg border border-gray-200 hover:border-primary/30 transition">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <UserRound className="text-sky-600 w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800">Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-700 text-sm">
                <p>
                  <strong>Mã khách hàng:</strong> {tenant?.customerCode}
                </p>
                <p>
                  <strong>Giới tính:</strong> {tenant?.gender === "MALE" ? "Nam" : "Nữ"}
                </p>
                <p>
                  <strong>Ngày sinh:</strong> {tenant?.dob && formatDate(new Date(tenant.dob))}
                </p>
                <p>
                  <strong>CMND/CCCD:</strong> {tenant?.identityCardNumber}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg border border-gray-200 hover:border-primary/30 transition">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Mail className="text-amber-500 w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800">Thông tin liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-700 text-sm">
                <p>
                  <strong>Email:</strong> {tenant?.email}
                </p>
                <p>
                  <strong>SĐT:</strong> {tenant?.phoneNumber}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {tenant?.address}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg border border-gray-200 hover:border-primary/30 transition">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FileSignature className="text-blue-600 w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800">Thông tin hợp đồng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-700 text-sm">
                <p>
                  <strong>Mã hợp đồng:</strong> {tenant?.contractCode}
                </p>
                <p>
                  <strong>Ngày kết thúc:</strong> {tenant?.endDate && formatDate(new Date(tenant.endDate))}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg border border-gray-200 hover:border-primary/30 transition">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Building2 className="text-cyan-500 w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800">Tòa nhà & Phòng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-700 text-sm">
                <p>
                  <strong>Tòa nhà:</strong> {tenant?.buildingName}
                </p>
                <p>
                  <strong>Phòng:</strong> {tenant?.roomCode}
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg border border-gray-200 hover:border-primary/30 transition">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FileText className="text-purple-600 w-6 h-6" />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-800">Tài liệu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-gray-700 text-sm">
                <p>Chưa có tài liệu đính kèm.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="shrink-0 flex justify-between text-xs text-muted-foreground px-6 py-4 border-t bg-white">
          <span>Ngày tạo: {tenant?.createdAt && formatDateTime(new Date(tenant.createdAt))}</span>
          <span>Cập nhật gần nhất: {tenant?.updatedAt && formatDateTime(new Date(tenant.updatedAt))}</span>
        </div>
      </div>
    </div>
  );
};

export default DetailTenant;
