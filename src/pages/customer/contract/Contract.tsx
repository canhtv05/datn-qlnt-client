import StatisticCard from "@/components/StatisticCard";
import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import { GET_BTNS } from "@/constant";
import { useContract } from "./useContract";
import ContractButton from "@/components/customer/contract/ContractButton";
import ContractFilter from "@/components/customer/contract/ContractFilter";
import AddOrUpdateContract from "@/components/customer/contract/AddOrUpdateContract";
import { ContractResponse, ColumnConfig } from "@/types";

const Contract = () => {
  const {
    query: { page, size },
    data,
    isLoading,
    rowSelection,
    setRowSelection,
    dataStatisticsContracts,
    props,
    isModalOpen,
    setIsModalOpen,
    value,
    errors,
    ConfirmDialog,
    handleActionClick,
    handleSaveContract,
    roomOptions,
    tenantOptions,
    assetOptions,
    servicesOptions,
    vehiclesOptions,
    handleChange,
  } = useContract();

  const columnConfigs: ColumnConfig[] = [
    {
      label: "Mã hợp đồng",
      accessorKey: "contractCode",
      isSort: true,
      hasHighlight: true,
    },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: ContractResponse) => (
        <div className="flex gap-2">
          {GET_BTNS("update", "delete", "status", "view").map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant={btn.type}
                    className="cursor-pointer"
                    onClick={() => handleActionClick(row, btn.type as "update" | "delete" | "view" | "status")}
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
                    className="size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      ),
    },
    {
      label: "Phòng",
      accessorKey: "roomCode",
      isSort: true,
      isCenter: true,
    },
    {
      label: "Khách thuê",
      accessorKey: "tenants",
      render: (row: ContractResponse) => row.tenants?.map((t) => t.fullName).join(", ") || "—",
    },
    {
      label: "Số người",
      accessorKey: "numberOfPeople",
      isSort: true,
      isCenter: true,
      render: (row: ContractResponse) => `${row.numberOfPeople} người/phòng`,
    },
    {
      label: "Ngày bắt đầu",
      accessorKey: "startDate",
      isSort: true,
      render: (row: ContractResponse) =>
        new Date(row.startDate).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      label: "Ngày kết thúc",
      accessorKey: "endDate",
      isSort: true,
      render: (row: ContractResponse) =>
        new Date(row.endDate).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
    {
      label: "Tiền cọc",
      accessorKey: "deposit",
      isSort: true,
      isCenter: true,
      render: (row: ContractResponse) => `${row.deposit?.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      label: "Tiền phòng",
      accessorKey: "roomPrice",
      isSort: true,
      isCenter: true,
      render: (row: ContractResponse) => `${row.roomPrice?.toLocaleString("vi-VN")} VNĐ`,
    },
    {
      label: "Trạng thái",
      accessorKey: "status",
      isSort: true,
      isCenter: true,
      hasBadge: true,
      render: (row: ContractResponse) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <div className="flex flex-col">
      <StatisticCard data={dataStatisticsContracts} />
      <ContractButton ids={rowSelection} />
      <ContractFilter props={props} />
      <DataTable<ContractResponse>
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
        title="Hợp đồng"
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleSaveContract}
        desc={Notice.UPDATE}
      >
        <AddOrUpdateContract
          value={value}
          errors={errors}
          handleChange={handleChange}
          roomOptions={roomOptions}
          tenantOptions={tenantOptions}
          assetOptions={assetOptions}
          servicesOptions={servicesOptions}
          vehiclesOptions={vehiclesOptions}
          type="update"
        />
      </Modal>

      <ConfirmDialog />
    </div>
  );
};

export default Contract;
