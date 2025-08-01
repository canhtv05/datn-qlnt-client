import DataTable from "@/components/DataTable";
import Overlay from "@/components/Overlay";
import StatusBadge from "@/components/ui/StatusBadge";
import TenantResponse, { ApiResponse, ColumnConfig } from "@/types";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { httpRequest } from "@/utils/httpRequest";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const RoomMembers = () => {
  const { id } = useParams();

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
      return;
    }
  }, [isError]);

  const columnConfigs: ColumnConfig[] = [
    {
      label: "Họ tên",
      accessorKey: "fullName",
      isSort: true,
      hasHighlight: true,
      isCenter: true,
    },
    {
      label: "Là đại diện",
      accessorKey: "isRepresentative",
      isCenter: true,
      isSort: true,
      render: (row: TenantResponse) => {
        return row.isRepresentative ? (
          <StatusBadge status={"isRepresentative=true"} />
        ) : (
          <StatusBadge status={"isRepresentative=false"} />
        );
      },
    },
    {
      label: "Giới tính",
      accessorKey: "gender",
      isSort: true,
      isCenter: true,
      hasBadge: true,
    },
    {
      label: "Ngày sinh",
      accessorKey: "dob",
      isSort: true,
      isCenter: true,
      render: (row) => new Date(row.dob).toLocaleDateString("vi-VN") ?? "_",
    },
    {
      label: "Số điện thoại",
      accessorKey: "phoneNumber",
      isSort: true,
      isCenter: true,
    },
    {
      label: "CCCD/CMT",
      accessorKey: "identificationNumber",
      isSort: true,
      isCenter: true,
    },
    {
      label: "Email",
      accessorKey: "email",
      isSort: true,
      isCenter: true,
    },
    {
      label: "Địa chỉ",
      accessorKey: "address",
      isSort: true,
    },

    {
      label: "Trạng thái",
      accessorKey: "tenantStatus",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
  ];

  return (
    <Overlay>
      <div className="bg-background rounded-ms w-full pb-5 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border shrink-0">
          <h3 className="font-semibold">Thành viên trong phòng</h3>
        </div>

        <div className="overflow-y-auto px-4 py-2 flex-1">
          <DataTable<TenantResponse>
            data={data?.data ?? []}
            columns={buildColumnsFromConfig(columnConfigs, false)}
            page={0}
            size={0}
            totalPages={0}
            totalElements={data?.data.length || 0}
            loading={isLoading}
            rowSelection={{}}
            setRowSelection={() => {}}
            disablePagination
            disableSelect
          />
        </div>
      </div>
    </Overlay>
  );
};

export default RoomMembers;
