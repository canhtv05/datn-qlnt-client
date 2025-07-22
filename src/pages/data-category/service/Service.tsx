import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, ServiceResponse } from "@/types";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import { useAssetType } from "./useService";
import { GET_BTNS } from "@/constant";
import ServiceButton from "@/components/data-category/service/ServiceButton";
import ServiceFilter from "@/components/data-category/service/ServiceFilter";
import AddOrUpdateService from "@/components/data-category/service/AddOrUpdateService";
import StatisticCard from "@/components/StatisticCard";

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
    dataServices,
    errors,
    ConfirmDialog,
  } = useAssetType();
  const { page, size } = query;

  const columnConfigs: ColumnConfig[] = [
    {
      label: "Tên dịch vụ",
      accessorKey: "name",
      isSort: true,
    },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: ServiceResponse) => (
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
                      const type = btn.type as "update";
                      handleActionClick(row, type);
                    }}
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
                    className={"size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"}
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      ),
    },
    {
      label: "Loại dịch vụ",
      accessorKey: "serviceCategory",
      isSort: true,
      isCenter: true,
      hasBadge: true,
    },
    {
      label: "Đơn vị",
      accessorKey: "unit",
      isSort: false,
      isCenter: true,
    },
    {
      label: "Giá",
      accessorKey: "price",
      isSort: true,
    },
    {
      label: "Áp dụng theo",
      accessorKey: "serviceCalculation",
      isSort: true,
      isCenter: true,
      hasBadge: true,
    },
    {
      label: "Trạng thái",
      accessorKey: "status",
      isSort: true,
      isCenter: true,
      hasBadge: true,
    },
    {
      label: "Mô tả",
      accessorKey: "description",
      isSort: false,
    },
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
  ];

  return (
    <div className="flex flex-col">
      <StatisticCard data={dataServices} />
      <ServiceButton ids={rowSelection} />
      <ServiceFilter props={props} />
      <DataTable<ServiceResponse>
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
        title="Dịch vụ"
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleUpdateFloor}
        desc={Notice.UPDATE}
      >
        <AddOrUpdateService
          handleChange={handleChange}
          value={value}
          setValue={setValue}
          errors={errors}
          type="update"
        />
      </Modal>
      <ConfirmDialog />
    </div>
  );
};

export default AssetType;
