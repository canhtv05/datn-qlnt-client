import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, DefaultServiceResponse } from "@/types";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import { GET_BTNS } from "@/constant";
import { useDefaultService } from "./useDefaultService";
import DefaultServiceButton from "@/components/data-category/default-service/DefaultServiceButton";
import DefaultServiceFilter from "@/components/data-category/default-service/DefaultServiceFilter";
import AddOrUpdateDefaultService from "@/components/data-category/default-service/AddOrUpdateDefaultService";
import StatisticCard from "@/components/StatisticCard";

const DefaultService = () => {
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
    dataDefaultServices,
    setValue,
    errors,
    defaultServiceInit,
    ConfirmDialog,
  } = useDefaultService();
  const { page, size } = query;

  const columnConfigs: ColumnConfig[] = [
    {
      label: "Tên dịch vụ",
      accessorKey: "serviceName",
      isSort: true,
    },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: DefaultServiceResponse) => {
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
                        const type = btn.type as "update";
                        handleActionClick(row, type);
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

    {
      label: "Giá áp dụng",
      accessorKey: "pricesApply",
      isSort: true,
    },
    {
      label: "Áp dụng theo",
      accessorKey: "defaultServiceAppliesTo",
      isSort: true,
      isCenter: true,
      hasBadge: true,
    },
    {
      label: "Tòa nhà",
      accessorKey: "buildingName",
      isSort: true,
    },
    {
      label: "Tầng",
      accessorKey: "floorName",
      isSort: true,
    },
    {
      label: "Trạng thái",
      accessorKey: "defaultServiceStatus",
      isSort: true,
      isCenter: true,
      hasBadge: true,
    },
    {
      label: "Ngày bắt đầu áp dụng",
      accessorKey: "startApplying",
      isSort: true,
      hasDate: true,
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
      <StatisticCard data={dataDefaultServices} />
      <DefaultServiceButton ids={rowSelection} defaultServiceInit={defaultServiceInit} />
      <DefaultServiceFilter props={props} />
      <DataTable<DefaultServiceResponse>
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
        title="Dịch vụ mặc định"
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleUpdateFloor}
        desc={Notice.UPDATE}
      >
        <AddOrUpdateDefaultService
          defaultServiceInit={defaultServiceInit}
          type="update"
          handleChange={handleChange}
          value={value}
          setValue={setValue}
          errors={errors}
        />
      </Modal>
      <ConfirmDialog />
    </div>
  );
};

export default DefaultService;
