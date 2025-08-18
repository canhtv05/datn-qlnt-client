import StatisticCard from "@/components/StatisticCard";
import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import TenantResponse, { ColumnConfig } from "@/types";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import { useTenant } from "./useTenant";
import TenantButton from "@/components/customer/tenant/TenantButton";
import TenantFilter from "@/components/customer/tenant/TenantFilter";
import AddOrUpdateTenant from "@/components/customer/tenant/AddOrUpdateTenant";
import { GET_BTNS } from "@/constant";
import StatusBadge from "@/components/ui/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

const Tenant = () => {
  const {
    props,
    data,
    isLoading,
    query,
    handleActionClick,
    dataStatisticsTenants,
    rowSelection,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    handleUpdateFloor,
    value,
    setValue,
    errors,
    handleBlur,
    ConfirmDialog,
  } = useTenant();
  const { page, size } = query;

  const columnConfigs: ColumnConfig[] = [
    { label: "Mã khách", accessorKey: "customerCode", isSort: true, hasHighlight: true },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: TenantResponse) => {
        const tenant: TenantResponse = row;
        return (
          <div className="flex gap-2">
            {GET_BTNS("update", "delete", "status", "view").map((btn, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => {
                        const type = btn.type as "update" | "delete" | "view";
                        handleActionClick(tenant, type);
                      }}
                    >
                      <btn.icon className="text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="text-white" style={{ background: btn.arrowColor }} arrow={false}>
                    <p>{btn.tooltipContent}</p>
                    <TooltipPrimitive.Arrow
                      style={{
                        fill: btn.arrowColor,
                        background: btn.arrowColor,
                      }}
                      className={"size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"}
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        );
      },
    },
    { label: "Họ tên", accessorKey: "fullName", isSort: true },
    {
      label: "Hình ảnh",
      accessorKey: "pictureUrl",
      isCenter: true,
      render(row) {
        return (
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.pictureUrl} alt={row.fullName} />
            <AvatarFallback>{row.fullName?.charAt(0).toUpperCase() || "N/A"}</AvatarFallback>
          </Avatar>
        );
      },
    },
    { label: "Giới tính", accessorKey: "gender", isSort: true, isCenter: true, hasBadge: true },
    {
      label: "Ngày sinh",
      accessorKey: "dob",
      isSort: true,
      render: (row: TenantResponse) => {
        return <span>{formatDate(row.dob)}</span>;
      },
    },
    { label: "Email", accessorKey: "email", isSort: true },
    { label: "Số điện thoại", accessorKey: "phoneNumber", isSort: true },
    { label: "Địa chỉ", accessorKey: "address" },
    { label: "Số CMND/CCCD", accessorKey: "identificationNumber" },
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
      label: "Trạng thái",
      accessorKey: "tenantStatus",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
  ];

  return (
    <div className="flex flex-col">
      <StatisticCard data={dataStatisticsTenants} />
      <div className="shadow-lg">
        <TenantButton ids={rowSelection} data={data?.data ?? []} />
        <TenantFilter props={props} type="default" />
        <DataTable<TenantResponse>
          data={data?.data ?? []}
          columns={buildColumnsFromConfig(columnConfigs)}
          page={Number(page)}
          size={Number(size)}
          totalElements={data?.meta?.pagination?.total || 0}
          totalPages={data?.meta?.pagination?.totalPages || 0}
          loading={isLoading}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
        <Modal
          title="Khách thuê"
          trigger={null}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onConfirm={handleUpdateFloor}
          desc={Notice.UPDATE}
        >
          <AddOrUpdateTenant
            onBlur={handleBlur}
            handleChange={handleChange}
            value={value}
            setValue={setValue}
            errors={errors}
          />
        </Modal>
        <ConfirmDialog />
      </div>
    </div>
  );
};

export default Tenant;
