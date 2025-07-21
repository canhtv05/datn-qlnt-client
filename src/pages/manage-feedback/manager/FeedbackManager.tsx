import { useFeedbackManager } from "./useFeedbackManager";
import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import FeedbackManagerFilter from "@/components/manage-feedback/manager/FeedbackManagerFilter";
import FeedbackManagerButton from "@/components/manage-feedback/manager/FeedbackManagerButton";
import { FeedbackResponse, ColumnConfig } from "@/types";
import { formatDateTime } from "@/lib/date";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { FeedbackStatus } from "@/enums";
import { CheckCircle2 } from "lucide-react";

// Feedback status label mapping
const feedbackStatusLabels: Record<FeedbackStatus, string> = {
  CHUA_XU_LY: "Chưa xử lý",
  DANG_XU_LY: "Đang xử lý",
  DA_XU_LY: "Đã xử lý",
  HUY: "Hủy",
};

// const statusColors: Record<FeedbackStatus, string> = {
//   CHUA_XU_LY: "#FBBF24",
//   DANG_XU_LY: "#3B82F6",
//   DA_XU_LY: "#10B981",
//   HUY: "#EF4444",
// };

const FeedbackManager = () => {
  const {
    data,
    isLoading,
    query: { page, size },
    updateStatus,
    props,
  } = useFeedbackManager();

  const columnConfigs: ColumnConfig[] = [
    {
      label: "Người gửi",
      accessorKey: "fullName",
      isSort: true,
    },
    // {
    //   label: "Tòa nhà",
    //   accessorKey: "buildingName",
    //   isSort: true,
    // },
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
      label: "Đánh giá",
      accessorKey: "rating",
      isSort: true,
      isCenter: true,
    },
    {
      label: "Nội dung",
      accessorKey: "content",
    },
    {
      label: "Ngày tạo",
      accessorKey: "createdAt",
      isSort: true,
      render: (row: FeedbackResponse) => <>{formatDateTime(row.createdAt)}</>,
    },
    {
      label: "Phòng",
      accessorKey: "roomCode",
      isSort: true,
    },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isCenter: true,
      render: (row: FeedbackResponse) => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="status">
                    <CheckCircle2 className="text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {Object.entries(feedbackStatusLabels).map(([key, label]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() =>
                        updateStatus({
                          feedbackId: row.id,
                          feedbackStatus: key as FeedbackStatus,
                        })
                      }
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent
              className="text-white"
              style={{ background: "#10B981" }}
              arrow={false}
            >
              <p>Chọn trạng thái cần cập nhật</p>
              <TooltipPrimitive.Arrow
                style={{
                  fill: "#10B981",
                  background: "#10B981",
                }}
                className="size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
              />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
  ];
  console.log("Dữ liệu table:", data?.data);
  return (
    <div className="flex flex-col">
      <FeedbackManagerButton ids={[]} />
      <FeedbackManagerFilter props={props} />
      <DataTable<FeedbackResponse>
        data={data?.data ?? []}
        columns={buildColumnsFromConfig(columnConfigs)}
        page={Number(page)}
        size={Number(size)}
        totalElements={data?.meta?.pagination?.total || 0}
        totalPages={data?.meta?.pagination?.totalPages || 0}
        loading={isLoading}
        rowSelection={[]}
        setRowSelection={() => {}}
      />
    </div>
  );
};

export default FeedbackManager;
