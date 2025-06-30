import DataTable from "@/components/DataTable";
import { SquarePen, Trash2 } from "lucide-react";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { AssetTypeResponse, ColumnConfig, IBtnType } from "@/types";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import { useAssetType } from "./useAssetType";
import AssetTypeButton from "@/components/data-category/asset-type/AssetTypeButton";
import AssetTypeFilter from "@/components/data-category/asset-type/AssetTypeFilter";
import AddOrUpdateAssetType from "@/components/data-category/asset-type/AddOrUpdateAssetType";

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

const AssetType = () => {
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
  } = useAssetType();
  const { page, size } = query;

  const columnConfigs: ColumnConfig[] = [
    { label: "Tên loại tài sản", accessorKey: "nameAssetType", isSort: true },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: AssetTypeResponse) => {
        const assetType: AssetTypeResponse = row;
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
                        handleActionClick(assetType, type);
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
    { label: "Nhóm tài sản", accessorKey: "assetGroup", isSort: true, isCenter: true, hasBadge: true },
    { label: "Mô tả", accessorKey: "discriptionAssetType", isSort: false },
  ];

  return (
    <div className="flex flex-col">
      <AssetTypeButton ids={rowSelection} />
      <AssetTypeFilter props={props} />
      <DataTable<AssetTypeResponse>
        data={data?.data?.data ?? []}
        columns={buildColumnsFromConfig(columnConfigs)}
        page={Number(page)}
        size={Number(size)}
        totalElements={data?.data.meta?.pagination?.total || 0}
        totalPages={data?.data.meta?.pagination?.totalPages || 0}
        loading={isLoading}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
      <Modal
        title="Loại tài sản"
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleUpdateFloor}
        desc={Notice.UPDATE}
      >
        <AddOrUpdateAssetType handleChange={handleChange} value={value} setValue={setValue} errors={errors} />
      </Modal>
      <ConfirmDialog />
    </div>
  );
};

export default AssetType;
