import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, ServiceRoomResponse } from "@/types";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import { useServiceRoom } from "./useServiceRoom";
import { GET_BTNS } from "@/constant";
import ServiceRoomButton from "@/components/data-category/service-room/ServiceRoomButton";
import ServiceRoomFilter from "@/components/data-category/service-room/ServiceRoomFilter";
import AddOrUpdateServiceRoom from "@/components/data-category/service-room/AddOrUpdateServiceRoom";
import StatisticCard from "@/components/StatisticCard";

const ServiceRoom = () => {
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
    dataServices,
    serviceRoomInit,
  } = useServiceRoom();
  const { page, size } = query;

  const columnConfigs: ColumnConfig[] = [
    { label: "Mã sử dụng", accessorKey: "usageCode", isSort: true, isCenter: true, hasHighlight: true },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: ServiceRoomResponse) => {
        const serviceRoom = row;
        return (
          <div className="flex gap-2">
            {GET_BTNS("update", "delete", "status").map((btn, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => {
                        handleActionClick(serviceRoom, btn.type as "update");
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
                      className="size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        );
      },
    },
    { label: "Tên dịch vụ", accessorKey: "name", isSort: true },
    { label: "Giá tổng", accessorKey: "totalPrice", isSort: true },
    { label: "Trạng thái", accessorKey: "serviceRoomStatus", isSort: true, hasBadge: true, isCenter: true },
    { label: "Mã phòng", accessorKey: "roomCode", isSort: true, isCenter: true },
    { label: "Ngày bắt đầu", accessorKey: "startDate", isSort: true, hasDate: true },
    { label: "Ngày áp dụng", accessorKey: "applyTime", isSort: true, hasDate: true },
    { label: "Mô tả", accessorKey: "descriptionServiceRoom", isSort: false },
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

    { label: "Mã phòng", accessorKey: "roomId", isHidden: true },
    { label: "Mã dịch vụ", accessorKey: "serviceId", isHidden: true },
  ];

  return (
    <div className="flex flex-col">
      <StatisticCard data={dataServices} />
      <ServiceRoomButton ids={rowSelection} serviceRoomInit={serviceRoomInit} />
      <ServiceRoomFilter props={props} />
      <DataTable<ServiceRoomResponse>
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
        title="Tài sản phòng"
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleUpdateFloor}
        desc={Notice.UPDATE}
      >
        <AddOrUpdateServiceRoom
          serviceRoomInit={serviceRoomInit}
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

export default ServiceRoom;
