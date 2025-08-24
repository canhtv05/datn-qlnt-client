import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { httpRequest } from "@/utils/httpRequest";
import { toast } from "sonner";
import { ApiResponse, TenantDetailResponse } from "@/types";
import StatusBadge from "@/components/ui/StatusBadge";
import { useEffect } from "react";
import Image from "@/components/Image";
import { useTranslation } from "react-i18next";

const NA = "N/A";

const DetailTenant = () => {
  const { t } = useTranslation();
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

  useEffect(() => {
    if (isError) {
      toast.error(t("tenant.detail.totalContract"));
      return;
    }
  }, [isError, t]);

  return (
    <div className="bg-background rounded-sm w-full max-h-[90vh] flex flex-col">
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/80 to-primary text-white rounded-t-sm">
        <h3 className="text-lg font-semibold">{t("tenant.detail.title")}</h3>
        <p className="text-xs mt-1">{t("tenant.detail.subtitle")}</p>
      </div>
      <div className="overflow-y-auto">
        <div className="bg-background md:gap-10 flex justify-center 2xl:flex-row flex-col md:px-20 px-5 items-center py-5 rounded-b-sm">
          <aside className="shrink-0 flex flex-col items-center gap-2">
            <Image src={tenant?.pictureUrl} className="size-50 rounded-none" />
            <div className="flex gap-2">
              <StatusBadge status={tenant?.tenantStatus ?? "__EMPTY__"} />
            </div>
          </aside>
          <main className="flex lg:flex-row flex-col lg:gap-1 gap-5 items-start md:justify-start justify-center h-full w-full flex-1">
            <div className="flex flex-col w-full justify-between h-full">
              <div className="flex items-center w-full gap-2 mt-5 md:mt-0">
                <span className="uppercase text-[12px] whitespace-nowrap">
                  {t("tenant.detail.personalInfo")}
                </span>
                <div className="flex-1 h-px bg-border mr-10" />
              </div>
              <h3 className="md:text-[24px] text-[16px] font-semibold text-primary md:max-w-[100%] max-w-[80%] overflow-hidden whitespace-nowrap text-ellipsis">
                {t("tenant.response.fullName")}: {tenant?.fullName ?? NA}
              </h3>
              <span className="text-sm font-medium">
                {t("tenant.response.customerCode")}: {tenant?.customerCode ?? NA}
              </span>
              <span className="text-sm font-medium">
                {t("tenant.response.gender")}: {tenant?.gender ?? NA}
              </span>
              <span className="text-sm font-medium">
                {t("tenant.response.dob")}:{" "}
                {tenant?.dob ? new Date(tenant?.dob).toLocaleDateString("vi-VN") : NA}
              </span>
              <span className="text-sm font-medium">
                {t("tenant.response.phoneNumber")}: {tenant?.phoneNumber ?? NA}
              </span>
              <span className="text-sm font-medium">
                {t("tenant.response.identityCardNumber")}: {tenant?.identityCardNumber ?? NA}
              </span>
              <span className="text-sm font-medium break-words whitespace-normal">
                {t("tenant.response.email")}: {tenant?.email ?? NA}
              </span>
              <span className="text-sm font-medium break-words whitespace-normal">
                {t("tenant.response.address")}: {tenant?.address ?? NA}
              </span>
              <span className="text-sm font-medium break-words whitespace-normal">
                {t("tenant.detail.totalContract")}: {tenant?.totalContract ?? NA}
              </span>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DetailTenant;
