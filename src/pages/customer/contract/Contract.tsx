import StatisticCard from "@/components/StatisticCard";
import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import StatusBadge from "@/components/ui/StatusBadge";
import Modal from "@/components/Modal";
import { ContractStatus, Notice } from "@/enums";
import { GET_BTNS } from "@/constant";
import { useContract } from "./useContract";
import ContractButton from "@/components/customer/contract/ContractButton";
import ContractFilter from "@/components/customer/contract/ContractFilter";
import UpdateContract from "@/components/customer/contract/UpdateContract";
import { ContractResponse, ColumnConfig, IBtnType } from "@/types";
import { useTranslation } from "react-i18next";
import { Car, Play, Users2 } from "lucide-react";

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
    handleUpdateContract,
    handleChange,
    setValue,
  } = useContract();
  const { t } = useTranslation();

  const activeBtn = (isActive: boolean): IBtnType[] => {
    return isActive
      ? []
      : [
          {
            tooltipContent: "common.button.active",
            icon: Play,
            arrowColor: "var(--color-amber-500)",
            type: "cash",
            hasConfirm: false,
          },
        ];
  };

  const memberBtn: IBtnType[] = [
    {
      tooltipContent: "common.button.tenants",
      icon: Users2,
      arrowColor: "var(--color-purple-400)",
      type: "toggle",
      hasConfirm: true,
    },
    {
      tooltipContent: "common.button.vehicles",
      icon: Car,
      arrowColor: "var(--color-violet-400)",
      type: "deposit1",
      hasConfirm: true,
    },
  ];

  const BTNS = (isActive: boolean) => {
    return [...activeBtn(isActive), ...GET_BTNS("update", "delete", "view"), ...memberBtn];
  };

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
          {BTNS(row.status !== ContractStatus.CHO_KICH_HOAT).map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant={btn.type}
                    className="cursor-pointer"
                    onClick={() => handleActionClick(row, btn.type as "update" | "delete" | "view" | "toggle" | "cash")}
                  >
                    <btn.icon className="text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="text-white" style={{ background: btn.arrowColor }} arrow={false}>
                  <p>{t(btn.tooltipContent)}</p>
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
      label: "Ngày bắt đầu",
      accessorKey: "startDate",
      isSort: true,
      render: (row: ContractResponse) =>
        new Date(row.startDate).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      isCenter: true,
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
      isCenter: true,
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
      <div className="shadow-lg">
        <ContractButton ids={rowSelection} />
        <ContractFilter props={props} type="default" />
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
          onConfirm={handleUpdateContract}
          desc={Notice.UPDATE}
        >
          <UpdateContract value={value} errors={errors} handleChange={handleChange} setValue={setValue} />
        </Modal>
        <ConfirmDialog />
      </div>
    </div>
  );
};

export default Contract;
