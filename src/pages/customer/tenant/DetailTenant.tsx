import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { httpRequest } from "@/utils/httpRequest";
import { toast } from "sonner";
import { ApiResponse, TenantDetailResponse } from "@/types";
import StatusBadge from "@/components/ui/StatusBadge";
import { useEffect } from "react";
import Image from "@/components/Image";

const NA = "N/A";

const DetailTenant = () => {
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
      toast.error("Không thể tải thông tin khách thuê. Vui lòng thử lại sau.");
      return;
    }
  }, [isError]);

  return (
    <div className="bg-background rounded-sm w-full max-h-[90vh] flex flex-col">
      <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-primary/80 to-primary text-white rounded-t-sm">
        <h3 className="text-lg font-semibold">Xem chi tiết khách thuê</h3>
        <p className="text-xs mt-1">Thông tin người thuê, hợp đồng và liên hệ</p>
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
                <span className="uppercase text-[12px] whitespace-nowrap">Thông tin cá nhân</span>
                <div className="flex-1 h-px bg-border mr-10" />
              </div>
              <h3 className="md:text-[24px] text-[16px] font-semibold text-primary md:max-w-[100%] max-w-[80%] overflow-hidden whitespace-nowrap text-ellipsis">
                Họ tên: {tenant?.fullName ?? NA}
              </h3>
              <span className="text-sm font-medium">Mã: {tenant?.customerCode ?? NA}</span>
              <span className="text-sm font-medium">Giới tính: {tenant?.gender ?? NA}</span>
              <span className="text-sm font-medium">
                Ngày sinh: {tenant?.dob ? new Date(tenant?.dob).toLocaleDateString("vi-VN") : NA}
              </span>
              <span className="text-sm font-medium">SĐT: {tenant?.phoneNumber ?? NA}</span>
              <span className="text-sm font-medium">CCCD/CMT: {tenant?.identityCardNumber ?? NA}</span>
              <span className="text-sm font-medium break-words whitespace-normal">Email: {tenant?.email ?? NA}</span>
              <span className="text-sm font-medium break-words whitespace-normal">
                Địa chỉ: {tenant?.address ?? NA}
              </span>
              <span className="text-sm font-medium break-words whitespace-normal">
                Tổng hợp đồng: {tenant?.totalContract ?? NA}
              </span>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DetailTenant;
