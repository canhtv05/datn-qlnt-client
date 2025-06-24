import StatisticCard from "@/components/StatisticCard";
import DataTable from "@/components/DataTable";
import { ArrowRightLeft, PenTool, SquarePen, Trash2 } from "lucide-react";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import BuildingButton from "@/components/data-category/building/BuildingButton";
import BuildingFilter from "@/components/data-category/building/BuildingFilter";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { useBuilding } from "./useBuilding";
import {
  ApiResponse,
  BuildingResponse,
  ColumnConfig,
  IBtnType,
  IBuildingStatisticsResponse,
  ICreateBuildingValue,
} from "@/types";
import Modal from "@/components/Modal";
import AddBuilding from "@/components/data-category/building/AddBuilding";
import { ChangeEvent, useCallback, useState } from "react";
import { useFullAddress } from "@/hooks/useFullAddress";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { useAuthStore } from "@/zustand/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpRequest } from "@/utils/httpRequest";
import { handleMutationError } from "@/utils/handleMutationError";
import { toast } from "sonner";
import { Status } from "@/enums";
import { createBuildingSchema } from "@/lib/validation";

type AddData = ICreateBuildingValue & { userId: string | undefined };

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
  {
    tooltipContent: "Đổi trạng thái",
    icon: ArrowRightLeft,
    arrowColor: "var(--color-sky-500)",
    type: "status",
    hasConfirm: true,
  },
];

const Building = () => {
  const { props, data, isLoading, query } = useBuilding();
  const user = useAuthStore((s) => s.user);
  const { page, size } = query;

  const [value, setValue] = useState<ICreateBuildingValue>({
    actualNumberOfFloors: undefined,
    address: "",
    buildingCode: "",
    buildingName: "",
    buildingType: undefined,
    description: "",
    numberOfFloorsForRent: undefined,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { Address, fullAddress, initFromNames } = useFullAddress();
  const { clearErrors, errors, handleZodErrors } = useFormErrors<ICreateBuildingValue>();

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addBuildingMutation = useMutation({
    mutationKey: ["add-building"],
    mutationFn: async (payload: AddData) => await httpRequest.post("/buildings", payload),
    onError: (error) => {
      handleMutationError(error);
    },
    onSuccess: () => {
      toast.success(Status.UPDATE_SUCCESS);
      setIsModalOpen(false);
    },
  });

  const removeBuildingMutation = useMutation({
    mutationKey: ["remove-building"],
    mutationFn: async (id: string) => await httpRequest.put(`/buildings/soft-delete/${id}`),
  });

  const queryClient = useQueryClient();

  const { ConfirmDialog, openDialog } = useConfirmDialog<string>({
    onConfirm: async (id) => {
      if (!id) return false;
      return await handleRemoveBuildingById(id);
    },
    desc: "Bạn có chắc chắn muốn xóa tòa nhà này không?",
    type: "warn",
  });

  const handleRemoveBuildingById = async (id: string): Promise<boolean> => {
    try {
      await removeBuildingMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "buildings",
          });
          toast.success(Status.REMOVE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleAddBuilding = useCallback(async () => {
    try {
      const {
        actualNumberOfFloors,
        buildingCode,
        buildingName,
        buildingType,
        description,
        address,
        numberOfFloorsForRent,
      } = value;

      await createBuildingSchema.parseAsync(value);

      const data: AddData = {
        userId: user?.id,
        address: `${address}, ${fullAddress}`,
        buildingName,
        buildingCode,
        actualNumberOfFloors,
        buildingType,
        description,
        numberOfFloorsForRent,
      };

      await addBuildingMutation.mutateAsync(data, {
        onSuccess: () => {
          setValue({
            actualNumberOfFloors: undefined,
            address: "",
            buildingCode: "",
            buildingName: "",
            buildingType: undefined,
            description: "",
            numberOfFloorsForRent: undefined,
          });
        },
      });
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [addBuildingMutation, clearErrors, fullAddress, handleZodErrors, user?.id, value]);

  const handleActionClick = useCallback(
    (building: BuildingResponse, action: "update" | "delete" | "status") => {
      if (action === "update") {
        const parts = building.address.split(",").map((s) => s.trim());
        const len = parts.length;
        const wardName = parts[len - 3] || "";
        const districtName = parts[len - 2] || "";
        const provinceName = parts[len - 1] || "";

        initFromNames(wardName, districtName, provinceName);

        const detailedAddress = parts.slice(0, len - 3).join(", ");

        setValue({
          actualNumberOfFloors: building.actualNumberOfFloors,
          address: detailedAddress,
          buildingCode: building.buildingCode,
          buildingName: building.buildingName,
          buildingType: building.buildingType,
          description: building.description,
          numberOfFloorsForRent: building.numberOfFloorsForRent,
        });
        setIsModalOpen(true);
      } else if (action === "delete") {
        console.log("Xóa tòa nhà có ID:", building.id);
        // Gọi API để xóa
        openDialog(building.id);
      } else if (action === "status") {
        console.log("Đổi trạng thái tòa nhà có ID:", building.id);
        // Gọi API để đổi trạng thái
      }
    },
    [initFromNames, openDialog]
  );

  const columnConfigs: ColumnConfig[] = [
    { label: "Mã tòa nhà", accessorKey: "buildingCode", isSort: true, hasHighlight: true },
    {
      label: "Thao tác",
      accessorKey: "actions",
      isSort: false,
      isCenter: true,
      render: (row: BuildingResponse) => {
        const building: BuildingResponse = row;
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
                      onClick={() => handleActionClick(building, btn.type as "update" | "delete" | "status")}
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
    { label: "Tên tòa nhà", accessorKey: "buildingName", isSort: true },
    { label: "Địa chỉ", accessorKey: "address", isSort: true },
    { label: "Loại tòa nhà", accessorKey: "buildingType", isSort: true, hasBadge: true, isCenter: true },
    { label: "Mô tả", accessorKey: "description" },
    { label: "Trạng thái", accessorKey: "status", isSort: true, hasBadge: true, isCenter: true },
  ];

  const { data: statistics } = useQuery<ApiResponse<IBuildingStatisticsResponse>>({
    queryKey: ["building-statistics"],
    queryFn: async () => {
      const res = await httpRequest.get("/buildings/statistics");
      return res.data;
    },
  });

  const dataBuildings = [
    {
      icon: PenTool,
      label: "Tòa nhà",
      value: statistics?.data.totalBuilding ?? 0,
    },
    {
      icon: PenTool,
      label: "Hoạt động",
      value: statistics?.data.activeBuilding ?? 0,
    },
    {
      icon: PenTool,
      label: "Không hoạt động",
      value: statistics?.data.inactiveBuilding ?? 0,
    },
  ];

  const [rowSelection, setRowSelection] = useState({});

  return (
    <div className="flex flex-col">
      <StatisticCard data={dataBuildings} />
      <BuildingButton ids={rowSelection} />
      <BuildingFilter props={props} />
      <DataTable<BuildingResponse>
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
        title="Dự án/Tòa nhà"
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleAddBuilding}
      >
        <AddBuilding
          handleChange={handleChange}
          value={value}
          setValue={setValue}
          errors={errors}
          address={<Address />}
        />
      </Modal>
      <ConfirmDialog />
    </div>
  );
};

export default Building;
