import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { httpRequest } from "@/utils/httpRequest";

import TenantResponse, { ApiResponse } from "@/types";
import { UserCircle2, Phone, Mail, CalendarDays, Badge } from "lucide-react";
import { genderToString, lang, tenantStatusToString } from "@/lib/utils";
import { useTranslation } from "react-i18next";
const NA = "N/A";

const RoomMembers = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
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
      toast.error(t("roomMembers.loadError"));
    }
  }, [isError, t]);

  return (
    <div className="bg-background rounded-md w-full p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg">{t("roomMembers.title")}</h3>
      </div>

      {isLoading ? (
        Array.from({ length: 5 }).map((_, idx) => (
          <Skeleton key={idx} className="h-36 w-full rounded-md" />
        ))
      ) : !data?.data || data.data.length === 0 ? (
        <div className="text-center py-10 text-gray-500">{t("roomMembers.noMember")}</div>
      ) : (
        data.data.map((member, idx) => (
          <Card key={idx} className="rounded-md shadow hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCircle2 className="w-5 h-5" /> {member.fullName || NA}{" "}
                {member.isRepresentative && (
                  <span className="text-xs text-white bg-blue-500 px-2 py-0.5 rounded">
                    {t("roomMembers.representative")}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {/* Cột trái: thông tin cơ bản */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Badge className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">
                    {t("roomMembers.gender")}:
                  </span>
                  <span className="font-bold">{genderToString(member.gender)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">{t("roomMembers.dob")}:</span>
                  <span className="font-bold">
                    {member.dob ? new Date(member.dob).toLocaleDateString(lang) : NA}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">
                    {t("roomMembers.phone")}:
                  </span>
                  <span className="font-bold">{member.phoneNumber || NA}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">Email:</span>
                  <span className="font-bold">{member.email || NA}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium text-muted-foreground">
                    {t("roomMembers.status")}:
                  </span>
                  <span className="font-bold">{tenantStatusToString(member.tenantStatus)}</span>
                </div>
              </div>

              {/* Cột phải: CCCD */}
              <div className="flex flex-col gap-2">
                <span className="font-medium text-muted-foreground">
                  {t("roomMembers.identityCard")}:
                </span>
                <div className="flex gap-2 flex-wrap">
                  {member.frontCCCD ? (
                    <img
                      src={member.frontCCCD}
                      alt="Front CCCD"
                      className="h-32 w-44 object-cover rounded-md border"
                    />
                  ) : (
                    <span className="text-gray-400">{t("roomMembers.noData")}</span>
                  )}
                  {member.backCCCD ? (
                    <img
                      src={member.backCCCD}
                      alt="Back CCCD"
                      className="h-32 w-44 object-cover rounded-md border"
                    />
                  ) : (
                    <span className="text-gray-400">{t("roomMembers.noData")}</span>
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
