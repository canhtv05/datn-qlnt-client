import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { AssetResponse, ColumnConfig } from "@/types";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import { useAsset } from "./useAsset";
import AssetButton from "@/components/data-category/asset/AssetButton";
import AssetFilter from "@/components/data-category/asset/AssetFilter";
import AddOrUpdateAsset from "@/components/data-category/asset/AddOrUpdateAsset";
import { GET_BTNS } from "@/constant";
import StatisticCard from "@/components/StatisticCard";

const Asset = () => {
  const {
    props,
    data,
    dataAssets,
    isLoading,
    query,
    handleActionClick,
    rowSelection,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    handleUpdateFloor,
    value,
    setValue,
    errors,
    ConfirmDialog,
  } = useAsset();
  const { page, size } = query;

  const columnConfigs: ColumnConfig[] = [
    { label: "Tên tài sản", accessorKey: "nameAsset", isSort: true },
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
                        // const type = btn.type as "update";
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
    { label: "Loại tài sản", accessorKey: "assetType", isSort: true, isCenter: true, hasBadge: true },
    { label: "Tài sản thuộc về", accessorKey: "assetBeLongTo", isSort: true, isCenter: true, hasBadge: true },
    { label: "Tên loại tài sản", accessorKey: "assetType", isSort: true, isCenter: true, hasBadge: true },
    // { label: "Tên tòa nhà", accessorKey: "buildingName", isSort: true, isCenter: true },
    // { label: "Tên tầng", accessorKey: "nameFloor", isSort: true, isCenter: true },
    // { label: "Mã phòng", accessorKey: "roomCode", isSort: true, hasHighlight: true, isCenter: true },
    { label: "Trạng thái", accessorKey: "assetStatus", isSort: true, hasBadge: true, isCenter: true },
    // { label: "Tên khách thuê", accessorKey: "fullName", isSort: true },
    { label: "Giá", accessorKey: "price", isSort: true },
    { label: "Mô tả", accessorKey: "descriptionAsset", isSort: false },
    {
      label: "Ngày tạo",
      accessorKey: "createdAt",
      isSort: true,
      hasDate: true,
    },
    {
      label: "Ngày cập nhật",
      accessorKey: "updatedAt",
      isSort: true,
      hasDate: true,
    },
    { label: "Mã phòng", accessorKey: "roomID", isHidden: true },
    { label: "Mã tầng", accessorKey: "floorID", isHidden: true },
    { label: "Mã tòa nhà", accessorKey: "buildingID", isHidden: true },
    { label: "Mã khách thuê", accessorKey: "tenantId", isHidden: true },
  ];

  return (
    <div className="flex flex-col">
      <StatisticCard data={dataAssets} />
      <AssetButton ids={rowSelection} />
      <AssetFilter props={props} />
      <DataTable<AssetResponse>
        data={data?.data?.data ?? []}
        columns={buildColumnsFromConfig(columnConfigs)}
        page={Number(page)}
        size={Number(size)}
        totalElements={data?.data?.meta?.pagination?.total || 0}
        totalPages={data?.data?.meta?.pagination?.totalPages || 0}
        loading={isLoading}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
      <Modal
        title="Tài sản"
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleUpdateFloor}
        desc={Notice.UPDATE}
      >
        <AddOrUpdateAsset handleChange={handleChange} value={value} setValue={setValue} errors={errors} type="update" />
      </Modal>
      <ConfirmDialog />
    </div>
  );
};

export default Asset;
