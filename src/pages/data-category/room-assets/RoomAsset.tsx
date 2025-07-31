import { useRoomAssetAll } from "./useRoomAssetAll";
import StatisticCard from "@/components/StatisticCard";
import DataTable from "@/components/DataTable";
import Modal from "@/components/Modal";
import RoomFilter from "@/components/data-category/room/RoomFilter";
import { EyeIcon, SquarePen, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, IBtnType, RoomAssetAllResponse } from "@/types";
import { Notice } from "@/enums";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { formatNumberField } from "@/constant";
import RoomAssetDetailsDrawer from "@/components/data-category/room-assets/RoomAssetDetailsModal";
import RoomAssetButton from "@/components/data-category/room-assets/RoomAssetButton";
import AddOrUpdateRoomAsset from "@/components/data-category/room-assets/AddOrUpdateRoomAsset";
import RoomAssetFilter from "@/components/data-category/room-assets/RoomAssetFilter";

const btns: IBtnType[] = [
  {
    tooltipContent: "Xem chi tiết",
    icon: EyeIcon,
    arrowColor: "#44475A",
    type: "view",
    hasConfirm: false,
  },
  // {
  //   tooltipContent: "Chỉnh sửa",
  //   icon: SquarePen,
  //   arrowColor: "#44475A",
  //   type: "update",
  //   hasConfirm: true,
  // },
  // {
  //   tooltipContent: "Xóa",
  //   icon: Trash2,
  //   arrowColor: "var(--color-red-400)",
  //   type: "delete",
  //   hasConfirm: true,
  // },
];

const RoomAsset = () => {
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
    roomList,
  } = useRoomAssetAll();

  const { page, size } = query;
  const columnConfigs: ColumnConfig[] = [
    {
      label: "Mã phòng",
      accessorKey: "roomCode",
      isSort: true,
      hasHighlight: true,
    },
    {
      label: "Xem chi tiết",
      accessorKey: "actions",
      isCenter: true,
      render: (row: RoomAssetAllResponse) => (
        <div className="flex gap-2 justify-center">
          {btns.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant={btn.type}
                    className="cursor-pointer"
                    onClick={() => handleActionClick(row, btn.type as "update" | "delete")}
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
      label: "Số tài sản",
      accessorKey: "totalAssets",
      isSort: true,
      isCenter: true,
      render: (row: RoomAssetAllResponse) => (
        <span
          dangerouslySetInnerHTML={{
            __html: row.totalAssets ? formatNumberField.asset(row.totalAssets) : "Chưa có",
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
    // {
    //   label: "Ngày tạo",
    //   accessorKey: "createdAt",
    //   isSort: true,
    //   hasDate: true,
    // },
    // {
    //   label: "Ngày cập nhật",
    //   accessorKey: "updatedAt",
    //   isSort: true,
    //   hasDate: true,
    // },
  ];

  return (
    <div className="flex flex-col">
      <StatisticCard data={statistics} />
      {/* <RoomAssetButton ids={rowSelection} /> */}
      <RoomAssetFilter props={props} />
      <RoomAssetDetailsDrawer />
      <DataTable<RoomAssetAllResponse>
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
      {/* <Modal
        title="Dự án/Phòng"
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleSaveRoom}
        desc={Notice.UPDATE}
      >
        <AddOrUpdateRoomAsset
          value={value}
          handleChange={handleChange}
          setValue={setValue}
          errors={errors}
          roomList={roomList}
        />
      </Modal> */}
      <ConfirmDialog />
    </div>
  );
};

export default RoomAsset;
