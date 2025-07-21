import DataTable from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import { SquarePen } from "lucide-react";

import { FeedbackSelfResponse, ColumnConfig, IBtnType } from "@/types";
import { useFeedbackTenant } from "./useFeedbackTenant";
import { formatDateTime } from "@/lib/date";
import FeedbackTenantButton from "@/components/manage-feedback/tenant/FeedbackTenantButton";
import FeedbackTenantFilter from "@/components/manage-feedback/tenant/FeedbackTenantFilter";
import AddOrUpdateTenantFeedback from "@/components/manage-feedback/tenant/AddOrUpdateTenantFeedback";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";

const btns: IBtnType[] = [
  {
    tooltipContent: "Chỉnh sửa",
    icon: SquarePen,
    arrowColor: "#44475A",
    type: "update",
    hasConfirm: true,
  },
];

const FeedbackTenant = () => {
  const {
    query: { page, size },
    data,
    isLoading,
    rowSelection,
    setRowSelection,
    props,
    value,
    setValue,
    errors,
    handleSaveFeedback,
    handleActionClick,
    isModalOpen,
    setIsModalOpen,
    ConfirmDialog,
    tenantOptions,
    roomOptions,
  } = useFeedbackTenant();

  const columnConfigs: ColumnConfig[] = [
    { label: "Người phản hồi", accessorKey: "fullName", isSort: true },
    { label: "Mã phòng", accessorKey: "roomCode", isSort: true, isCenter: true },
    { label: "Nội dung", accessorKey: "content" },
    { label: "Đánh giá", accessorKey: "rating", isSort: true, isCenter: true },
    {
      label: "Loại phản hồi",
      accessorKey: "feedbackType",
      isSort: true,
      isCenter: true,
      hasBadge: true,
    },
    {
      label: "Trạng thái",
      accessorKey: "feedbackStatus",
      isSort: true,
      isCenter: true,
      hasBadge: true,
    },
    {
      label: "Tệp đính kèm",
      accessorKey: "attachment",
      render: (row: FeedbackSelfResponse) =>
        row.attachment ? (
          <a
            href={row.attachment}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Xem
          </a>
        ) : (
          <span>Không có</span>
        ),
    },
    {
      label: "Ngày tạo",
      accessorKey: "createdAt",
      isSort: true,
      render: (row: FeedbackSelfResponse) => <>{formatDateTime(row.createdAt)}</>,
    },
    {
      label: "Ngày cập nhật",
      accessorKey: "updatedAt",
      isSort: true,
      render: (row: FeedbackSelfResponse) => <>{formatDateTime(row.updatedAt)}</>,
    },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isCenter: true,
      render: (row: FeedbackSelfResponse) => (
        <div className="flex gap-2 justify-center">
          {btns.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant={btn.type}
                    className="cursor-pointer"
                    onClick={() =>
                      handleActionClick(row, btn.type as "update")
                    }
                  >
                    <btn.icon className="text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="text-white"
                  style={{ background: btn.arrowColor }}
                  arrow={false}
                >
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
  ];
  console.log("Dữ liệu table:", data?.data);
  return (
    <div className="flex flex-col">
      <FeedbackTenantButton
        ids={rowSelection}
        tenantOptions={tenantOptions}
        roomOptions={roomOptions}
      />

      <FeedbackTenantFilter props={props} />

      <DataTable<FeedbackSelfResponse>
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
        title="Phản hồi"
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleSaveFeedback}
        desc={Notice.UPDATE}
      >
        <AddOrUpdateTenantFeedback
          value={value}
          setValue={setValue}
          errors={errors}
          tenantOptions={tenantOptions}
          roomOptions={roomOptions}
        />
      </Modal>

      <ConfirmDialog />
    </div>
  );
};

export default FeedbackTenant;
