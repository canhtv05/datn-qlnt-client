import StatisticCard from "@/components/StatisticCard";
import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { ColumnConfig, VehicleResponse } from "@/types";
import Modal from "@/components/Modal";
import { Notice } from "@/enums";
import { useVehicle } from "./useVehicle";
import VehicleButton from "@/components/customer/vehicle/VehicleButton";
import VehicleFilter from "@/components/customer/vehicle/VehicleFilter";
import AddOrUpdateVehicle from "@/components/customer/vehicle/AddOrUpdateVehicle";
import { GET_BTNS } from "@/constant";

const Vehicle = () => {
  const {
    props,
    data,
    isLoading,
    query,
    handleActionClick,
    dataVehicles,
    rowSelection,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    handleChange,
    handleUpdateFloor,
    value,
    setValue,
    errors,
    tenants,
    ConfirmDialog,
  } = useVehicle();
  const { page, size } = query;

  const columnConfigs: ColumnConfig[] = [
    { label: "Chủ sở hữu", accessorKey: "fullName", isSort: true },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: VehicleResponse) => {
        const vehicle: VehicleResponse = row;
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
                        const type = btn.type as "update" | "delete";
                        handleActionClick(vehicle, type);
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
      label: "Loại phương tiện",
      accessorKey: "vehicleType",
      isSort: true,
      isCenter: true,
      hasBadge: true,
    },
    {
      label: "Biển số",
      accessorKey: "licensePlate",
      isSort: true,
    },
    {
      label: "Trạng thái",
      accessorKey: "vehicleStatus",
      isSort: true,
      isCenter: true,
      hasBadge: true,
    },
    {
      label: "Ngày đăng ký",
      accessorKey: "registrationDate",
      isSort: true,
      hasDate: true,
    },
    {
      label: "Mô tả",
      accessorKey: "describe",
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
      <StatisticCard data={dataVehicles} />
      <VehicleButton ids={rowSelection} tenants={tenants} />
      <VehicleFilter props={props} />
      <DataTable<VehicleResponse>
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
        title="Phương tiện"
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleUpdateFloor}
        desc={Notice.UPDATE}
      >
        <AddOrUpdateVehicle
          tenants={tenants}
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

export default Vehicle;
