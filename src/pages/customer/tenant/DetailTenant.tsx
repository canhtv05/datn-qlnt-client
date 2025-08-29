import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { httpRequest } from "@/utils/httpRequest";
import { toast } from "sonner";
import { ApiResponse, TenantDetailResponse } from "@/types";
import { useEffect, useState } from "react";
import { BsPersonFill, BsCalendarDate, BsTelephone, BsEnvelope } from "react-icons/bs";
import StatusBadge from "@/components/ui/StatusBadge";
import Image from "@/components/Image";
import { genderEnumToString, lang } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const NA = "N/A";

const DetailTenant = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<TenantDetailResponse | null>(null);

  const { data, isError } = useQuery<ApiResponse<TenantDetailResponse>>({
    queryKey: ["tenantDetail", id],
    queryFn: async () => {
      const res = await httpRequest.get(`/tenants/detail/${id}`);
      return res.data;
    },
    enabled: !!id,
    retry: 1,
  });

  useEffect(() => {
    if (isError) {
      toast.error(t("tenant.detail.errorFetch"));
      setLoading(false);
      return;
    }
    if (data?.data) {
      setTenant(data.data);
      setLoading(false);
    }
  }, [data, isError, t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <span className="text-gray-500 dark:text-gray-300">{t("common.loading")}</span>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <span className="text-red-600 dark:text-red-400">{t("tenant.detail.errorFetch")}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-background rounded-md transition-colors duration-300 p-6">
      <h1 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-8">{t("tenant.detail.title")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Thông tin cá nhân */}
        <div className="lg:col-span-1 bg-white dark:bg-input rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
          <div className="relative mb-6">
            {/* <Image src={tenant.pictureUrl} alt="Tenant" className="w-full h-90 object-cover rounded-md" /> */}
            <Image src={tenant.pictureUrl} alt="Tenant" className="w-full h-auto object-cover rounded-md" />
            <div className="mt-4 flex justify-center items-center">
              <StatusBadge status={tenant.tenantStatus ?? "__EMPTY__"} />
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <BsPersonFill className="text-blue-600 dark:text-blue-400 w-5 h-5" />
              <span className="text-neutral-800 dark:text-neutral-100">{tenant.fullName ?? NA}</span>
            </div>
            <div className="flex items-center space-x-3">
              <BsCalendarDate className="text-blue-600 dark:text-blue-400 w-5 h-5" />
              <span className="text-neutral-800 dark:text-neutral-100">
                {tenant.dob ? new Date(tenant.dob).toLocaleDateString(lang) : NA}
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <BsTelephone className="text-blue-600 dark:text-blue-400 w-5 h-5" />
              <span className="text-neutral-800 dark:text-neutral-100">{tenant.phoneNumber ?? NA}</span>
            </div>
            <div className="flex items-center space-x-3">
              <BsEnvelope className="text-blue-600 dark:text-blue-400 w-5 h-5" />
              <span className="text-neutral-800 dark:text-neutral-100">{tenant.email ?? NA}</span>
            </div>
          </div>
        </div>

        {/* CCCD và thông tin bổ sung */}
        <div className="lg:col-span-2 space-y-8">
          {/* CCCD */}
          <div className="bg-white dark:bg-input rounded-md shadow-lg p-6 transition-all hover:shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100">
              {t("tenant.detail.identityCardNumber")}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[tenant.frontCCCD, tenant.backCCCD].map((src, index) => (
              <div
                key={index}
                className="group relative flex p-2 rounded-md justify-center items-center bg-white shadow-lg dark:bg-input overflow-hidden h-48"
              >
                {src ? (
                  <Image
                    src={src}
                    alt={`CCCD ${index === 0 ? "Front" : "Back"}`}
                    className="w-full h-full object-contain transition-transform group-hover:scale-105 rounded-none"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-none">
                    <span className="text-gray-400">{t("common.noImage")}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Thông tin bổ sung */}
          <div className="bg-white rounded-md dark:bg-input shadow-lg p-6 transition-all hover:shadow-xl">
            <h2 className="text-xl font-semibold mb-4 text-neutral-800 dark:text-neutral-100">
              {t("tenant.detail.personalInfo")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-500 dark:text-gray-300">{t("tenant.response.gender")}</p>
                <p className="text-neutral-800 dark:text-neutral-100">{genderEnumToString(tenant.gender, t)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-300">{t("tenant.response.address")}</p>
                <p className="text-neutral-800 dark:text-neutral-100">{tenant.address ?? NA}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-300">{t("tenant.response.identityCardNumber")}</p>
                <p className="text-neutral-800 dark:text-neutral-100">{tenant.identityCardNumber ?? NA}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-300">{t("tenant.detail.totalContract")}</p>
                <p className="text-neutral-800 dark:text-neutral-100">{tenant.totalContract ?? NA}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTenant;
