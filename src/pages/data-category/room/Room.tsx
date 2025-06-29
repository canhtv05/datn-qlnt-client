import { useRoom } from "./useRoom";
import StatisticCard from "@/components/StatisticCard";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import AddOrUpdateRoom from "@/components/data-category/room/AddOrUpdateRoom";
import RoomButton from "@/components/data-category/room/RoomButton";
import RoomFilter from "@/components/data-category/room/RoomFilter";
import { SquarePen, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { RoomResponse, ColumnConfig, IBtnType } from "@/types";
import { Notice } from "@/enums";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { formatNumberField } from "@/constant";

const btns: IBtnType[] = [
  {
    tooltipContent: "Chỉnh sửa",
    icon: SquarePen,
    arrowColor: "#44475A",
    type: "update",
    hasConfirm: true,
  },
  {
    tooltipContent: "Xóa",
    icon: Trash2,
    arrowColor: "var(--color-red-400)",
    type: "delete",
    hasConfirm: true,
  },
];

const Room = () => {
  const {
    data,
    isLoading,
    statistics,
    value,
    setValue,
    handleChange,
    handleSaveRoom,
    isModalOpen,
    setIsModalOpen,
    errors,
    handleActionClick,
    ConfirmDialog,
    query,
    rowSelection,
    setRowSelection,
    props,
  } = useRoom();

  const { page, size } = query;
  const columnConfigs: ColumnConfig[] = [
    {
      label: "Mã phòng",
      accessorKey: "roomCode",
      isSort: true,
      hasHighlight: true,
    },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isCenter: true,
      render: (row: RoomResponse) => (
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
                      handleActionClick(row, btn.type as "update" | "delete")
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
    {
      label: "Diện tích",
      accessorKey: "acreage",
      isSort: true,
      isCenter: true,
      render: (row: RoomResponse) => (
        <span
          dangerouslySetInnerHTML={{
            __html: row.acreage ? formatNumberField.acreage(row.acreage) : "—",
          }}
        />
      ),
    },
    {
      label: "Giá",
      accessorKey: "price",
      isSort: true,
      isCenter: true,
      render: (row: RoomResponse) => (
        <span
          dangerouslySetInnerHTML={{
            __html: row.price ? formatNumberField.price(row.price) : "—",
          }}
        />
      ),
    },
    {
      label: "Số người tối đa",
      accessorKey: "maximumPeople",
      isSort: true,
      isCenter: true,
      render: (row: RoomResponse) => (
        <span
          dangerouslySetInnerHTML={{
            __html: row.maximumPeople
              ? formatNumberField.maximumPeople(row.maximumPeople)
              : "—",
          }}
        />
      ),
    },
    {
      label: "Loại phòng",
      accessorKey: "roomType",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: "Trạng thái",
      accessorKey: "status",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    { label: "Mô tả", accessorKey: "description" },
  ];

  return (
    <div className="flex flex-col">
      <StatisticCard data={statistics} />
      <RoomButton ids={rowSelection} />
      <RoomFilter props={props} />
      <DataTable<RoomResponse>
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
        title="Dự án/Phòng"
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleSaveRoom}
        desc={Notice.UPDATE}
      >
        <AddOrUpdateRoom
          value={value}
          handleChange={handleChange}
          setValue={setValue}
          errors={errors}
        />
      </Modal>
      <ConfirmDialog />
    </div>
  );
};

export default Room;
