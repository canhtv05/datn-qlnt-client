import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { AssetLittleResponse, AssetResponse, ColumnConfig, RoomAssetFormValue } from "@/types";
import { GET_BTNS } from "@/constant";
import { useRoomAsset } from "@/pages/data-category/room-assets/useRoomAsset";
import RoomAssetButton from "./RoomAssetButton";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import AddOrUpdateRoomAsset from "./AddOrUpdateRoomAsset";
import StatusBadge from "@/components/ui/StatusBadge";
import { Dispatch, SetStateAction } from "react";

interface RoomAssetTableProps {
  roomId: string;
}

const RoomAssetTable: React.FC<RoomAssetTableProps> = ({ roomId }) => {
  const {
    data,
    isLoading,
    query,
    handleActionClick,
    rowSelection,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    value,
    setValue,
    errors,
    handleSaveRoomAsset,
    ConfirmDialog,
  } = useRoomAsset({ roomId });
  const { page, size } = query;

  const columnConfigs: ColumnConfig[] = [
    { label: "Tên tài sản", accessorKey: "assetName", isSort: true },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: AssetResponse) => {
        const asset: AssetResponse = row;
        return (
          <div className="flex gap-2">
            {GET_BTNS("update", "delete", "status").map((btn, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => {
                        const type = btn.type as "update" | "delete" | "status";
                        handleActionClick(asset, type);
                      }}
                    >
                      <btn.icon className="text-white" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    className="text-white"
                    style={{
                      background: btn.arrowColor,
                    }}
                    arrow={false}
                  >
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
    { label: "Tài sản thuộc về", accessorKey: "assetBeLongTo", isSort: true, isCenter: true, hasBadge: true },
    { label: "Trạng thái", accessorKey: "assetStatus", isSort: true, hasBadge: true, isCenter: true },
    { label: "Giá", accessorKey: "price", isSort: true },
    { label: "Số lượng", accessorKey: "quantity", isSort: true, isCenter: true },
    { label: "Mô tả", accessorKey: "description", isSort: false },
  ];

  console.log(data?.data);

  return (
    <div className="flex flex-col pb-4 bg-background rounded-sm">
      <RoomAssetButton ids={rowSelection} roomId={roomId} type="detail" buildingOptions={[]} />
      <DataTable<AssetLittleResponse>
        data={data?.data?.assets ?? []}
        columns={buildColumnsFromConfig(columnConfigs)}
        page={Number(page)}
        size={Number(size)}
        totalElements={data?.meta?.pagination?.total || 0}
        totalPages={data?.meta?.pagination?.totalPages || 0}
        loading={isLoading}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        disablePagination
      />
      <div className="px-5 py-2 mt-5 bg-background w-full">
        <div className="w-full">
          <h3 className="font-semibold rounded-sm p-2 bg-primary/50 text-sm text-white mb-2 pl-5 border-b-2">
            Thông tin phòng
          </h3>
          <div className="px-5 flex border-primary/20 flex-col space-y-2 [&_>span]:text-sm [&_>strong]:text-sm border-b-2 border-r-2 border-l-2 -mt-3 rounded-b-sm">
            <strong className="mt-2">
              - Mã phòng: <span>{data?.data?.roomCode}</span>
            </strong>
            <strong>
              - Loại phòng: <span>{data?.data?.roomType && <StatusBadge status={data?.data?.roomType} />}</span>
            </strong>
            <strong>
              - Trạng thái: <span>{data?.data?.status && <StatusBadge status={data?.data?.status} />}</span>
            </strong>
            <strong className="pb-2">
              - Mô tả:{" "}
              <p className="inline-block">
                {data?.data?.description ||
                  (data?.data?.description && <StatusBadge status={data?.data?.description} />)}
              </p>
            </strong>
          </div>
        </div>
      </div>
      <Modal
        title="Cập nhật tài sản phòng"
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleSaveRoomAsset}
        desc={Notice.UPDATE}
      >
        <AddOrUpdateRoomAsset
          value={value}
          handleChange={(field, newValue) => {
            // @ts-expect-error: handleChange expects a synthetic event, but we are calling it with a custom object here
            handleChange({ target: { name: field, value: newValue } });
          }}
          setValue={setValue as Dispatch<SetStateAction<RoomAssetFormValue>>}
          errors={errors}
          roomList={[]}
          assetsList={[]}
          type="update"
          setBulkValue={() => {}}
          setAllRoomValue={() => {}}
          bulkValue={{
            assetId: "",
            roomId: "",
          }}
          allRoomValue={{
            assetId: "",
            buildingId: "",
          }}
          buildingOptions={[]}
        />
      </Modal>
      <ConfirmDialog />
    </div>
  );
};

export default RoomAssetTable;
