import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { httpRequest } from "@/utils/httpRequest";

import TenantResponse, { ApiResponse } from "@/types";
import { UserCircle2, Phone, Mail, CalendarDays, Badge } from "lucide-react";
import { genderToString, tenantStatusToString } from "@/lib/utils";
const NA = "N/A";

const RoomMembers = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isError, isLoading } = useQuery<ApiResponse<TenantResponse[]>>({
    queryKey: ["room-tenants-detail", id],
    queryFn: async () => {
      const res = await httpRequest.get(`/tenants/room-tenants/detail/${id}`);
      return res.data;
    },
    enabled: !!id,
    retry: 1,
  });

  useEffect(() => {
    if (isError) {
      toast.error("Không thể tải thành viên trong phòng. Vui lòng thử lại sau.");
    }
  }, [isError]);

  return (
    <div className="bg-background rounded-md w-full p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">Thành viên trong phòng</h3>
      </div>

      {isLoading ? (
        Array.from({ length: 5 }).map((_, idx) => <Skeleton key={idx} className="h-36 w-full rounded-md" />)
      ) : !data?.data || data.data.length === 0 ? (
        <div className="text-center py-10 text-gray-500">Không có thành viên nào trong phòng</div>
      ) : (
        data.data.map((member, idx) => (
          <Card key={idx} className="rounded-md shadow hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle2 className="w-5 h-5" /> {member.fullName || NA}{" "}
                {member.isRepresentative && (
                  <span className="text-xs text-white bg-blue-500 px-2 py-0.5 rounded">Đại diện</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* Cột trái: thông tin cơ bản */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Badge className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Giới tính:</span>
                  <span className="font-bold">{genderToString(member.gender)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Ngày sinh:</span>
                  <span className="font-bold">
                    {member.dob ? new Date(member.dob).toLocaleDateString("vi-VN") : NA}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Số điện thoại:</span>
                  <span className="font-bold">{member.phoneNumber || NA}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Email:</span>
                  <span className="font-bold">{member.email || NA}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Trạng thái:</span>
                  <span className="font-bold">{tenantStatusToString(member.tenantStatus)}</span>
                </div>
              </div>

              {/* Cột phải: CCCD */}
              <div className="flex flex-col gap-2">
                <span className="font-medium text-muted-foreground">CCCD/CMT:</span>
                <div className="flex gap-2 flex-wrap">
                  {member.frontCCCD ? (
                    <img src={member.frontCCCD} alt="Front CCCD" className="h-32 w-44 object-cover rounded-md border" />
                  ) : (
                    <span className="text-gray-400">Không có</span>
                  )}
                  {member.backCCCD ? (
                    <img src={member.backCCCD} alt="Back CCCD" className="h-32 w-44 object-cover rounded-md border" />
                  ) : (
                    <span className="text-gray-400">Không có</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default RoomMembers;
