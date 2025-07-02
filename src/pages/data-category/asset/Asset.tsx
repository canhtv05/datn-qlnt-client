import DataTable from "@/components/DataTable";
import { SquarePen, Trash2 } from "lucide-react";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { AssetResponse, ColumnConfig, IBtnType } from "@/types";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import { useAsset } from "./useAsset";
import AssetButton from "@/components/data-category/asset/AssetButton";
import AssetFilter from "@/components/data-category/asset/AssetFilter";
import AddOrUpdateAsset from "@/components/data-category/asset/AddOrUpdateAsset";

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

const Asset = () => {
  const {
    props,
    data,
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
            {btns.map((btn, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => {
                        const type = btn.type as "update";
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
    { label: "Tên loại tài sản", accessorKey: "nameAssetType", isSort: true, isCenter: true },
    { label: "Trạng thái", accessorKey: "assetStatus", isSort: true, hasBadge: true, isCenter: true },
    { label: "Tên tầng", accessorKey: "nameFloor", isSort: true },
    { label: "Mã phòng", accessorKey: "roomCode", isSort: true, hasHighlight: true },
    { label: "Tên khách thuê", accessorKey: "fullName", isSort: true },
    { label: "Tên tòa nhà", accessorKey: "buildingName", isSort: true },
    { label: "Giá", accessorKey: "price", isSort: true },
    { label: "Mô tả", accessorKey: "descriptionAsset", isSort: false },
  ];

  return (
    <div className="flex flex-col">
      <AssetButton ids={rowSelection} />
      <AssetFilter props={props} />
      <DataTable<AssetResponse>
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
        title="Tài sản"
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleUpdateFloor}
        desc={Notice.UPDATE}
      >
        <AddOrUpdateAsset handleChange={handleChange} value={value} setValue={setValue} errors={errors} />
      </Modal>
      <ConfirmDialog />
    </div>
  );
};

export default Asset;
