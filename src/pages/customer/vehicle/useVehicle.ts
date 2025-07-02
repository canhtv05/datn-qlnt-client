import { StatisticCardType } from "@/components/StatisticCard";
import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { updateFloorSchema } from "@/lib/validation";
import { ApiResponse, FloorFilterValues, FloorResponse, IFloorStatisticsResponse, UpdateFloorValue } from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building as BuildingIcon, CircleCheck as CircleCheckIcon, XCircle as XCircleIcon } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useVehicle = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    page = "1",
    size = "15",
    status = "",
    floorType = "",
    nameFloor = "",
    buildingId = "",
    maxRoom = "",
  } = queryFilter(searchParams, "page", "size", "buildingId", "status", "floorType", "nameFloor", "maxRoom");

  const { id } = useParams();
  const navigate = useNavigate();

  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [value, setValue] = useState<UpdateFloorValue>({
    descriptionFloor: "",
    floorType: undefined,
    maximumRoom: undefined,
    nameFloor: "",
    status: undefined,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedSize = Math.max(Number(size) || 15, 1);

  const { clearErrors, errors, handleZodErrors } = useFormErrors<UpdateFloorValue>();

  useEffect(() => {
    setFilterValues({ floorType, maxRoom, nameFloor, status, buildingId });
  }, [buildingId, floorType, maxRoom, nameFloor, status]);

  const [filterValues, setFilterValues] = useState<FloorFilterValues>({
    buildingId,
    floorType,
    maxRoom,
    nameFloor,
    status,
  });

  const handleClear = () => {
    setFilterValues({
      buildingId: "",
      maxRoom: "",
      floorType: "",
      nameFloor: "",
      status: "",
    });
    setSearchParams({});
  };

  const handleFilter = useCallback(() => {
    const params = new URLSearchParams();
    if (filterValues.status) params.set("status", filterValues.status);
    if (filterValues.floorType) params.set("floorType", filterValues.floorType);
    if (filterValues.maxRoom) params.set("maxRoom", filterValues.maxRoom);
    if (filterValues.nameFloor) params.set("nameFloor", filterValues.nameFloor);
    params.set("page", "1");
    if (
      filterValues.status ||
      filterValues.maxRoom ||
      filterValues.nameFloor ||
      filterValues.floorType ||
      filterValues.buildingId
    ) {
      if (filterValues.buildingId) {
        const query = params.toString();
        navigate(`/data-categories/floors/${filterValues.buildingId}?${query}`);
      } else {
        setSearchParams(params);
      }
    }
  }, [
    filterValues.buildingId,
    filterValues.floorType,
    filterValues.maxRoom,
    filterValues.nameFloor,
    filterValues.status,
    navigate,
    setSearchParams,
  ]);

  const { data, isLoading, isError } = useQuery<ApiResponse<FloorResponse[]>>({
    queryKey: ["floors", page, size, status, buildingId, id, maxRoom, nameFloor, floorType],
    queryFn: async () => {
      const params: Record<string, string> = {
        page: page.toString(),
        size: size.toString(),
      };

      if (status) params["status"] = status;
      if (maxRoom) params["maxRoom"] = maxRoom;
      if (nameFloor) params["nameFloor"] = nameFloor;
      if (floorType) params["floorType"] = floorType;
      if (id) params["buildingId"] = id;

      const res = await httpRequest.get("/floors", {
        params,
      });

      return res.data;
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    const { name, value } = e.target;
    setValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateFloorMutation = useMutation({
    mutationKey: ["update-floor"],
    mutationFn: async (payload: UpdateFloorValue) => await httpRequest.put(`/floors/${idRef.current}`, payload),
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const removeFloorMutation = useMutation({
    mutationKey: ["remove-floor"],
    mutationFn: async (id: string) => await httpRequest.put(`/floors/soft-delete/${id}`),
  });

  const toggleStatusBuildingMutation = useMutation({
    mutationKey: ["toggle-building"],
    mutationFn: async (id: string) => await httpRequest.put(`/floors/toggle-status/${id}`),
  });

  const handleToggleStatusFloorById = async (id: string): Promise<boolean> => {
    try {
      await toggleStatusBuildingMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "floors",
          });
          queryClient.invalidateQueries({ queryKey: ["floors-statistics"] });

          toast.success(Status.UPDATE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" | "status" }>({
    onConfirm: async ({ id, type }) => {
      if (type === "delete") return await handleRemoveFloorById(id);
      if (type === "status") return await handleToggleStatusFloorById(id);
      return false;
    },
  });

  const handleRemoveFloorById = async (id: string): Promise<boolean> => {
    try {
      await removeFloorMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "floors",
          });
          queryClient.invalidateQueries({ queryKey: ["floors-statistics"] });

          toast.success(Status.REMOVE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const handleUpdateFloor = useCallback(async () => {
    try {
      const { status, descriptionFloor, floorType, maximumRoom, nameFloor } = value;

      await updateFloorSchema.parseAsync(value);

      const data: UpdateFloorValue = {
        descriptionFloor: descriptionFloor.trim(),
        floorType,
        maximumRoom,
        nameFloor: nameFloor.trim(),
        status,
      };

      updateFloorMutation.mutate(data, {
        onSuccess: () => {
          setValue({
            descriptionFloor: "",
            floorType: undefined,
            maximumRoom: undefined,
            nameFloor: "",
            status: undefined,
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "floors",
          });
          queryClient.invalidateQueries({ queryKey: ["floors-statistics"] });
          toast.success(Status.UPDATE_SUCCESS);
          setIsModalOpen(false);
        },
      });
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [updateFloorMutation, clearErrors, handleZodErrors, queryClient, value]);

  const handleActionClick = useCallback(
    (floor: FloorResponse, action: "update" | "delete") => {
      idRef.current = floor.id;
      if (action === "update") {
        setValue({
          descriptionFloor: floor.descriptionFloor,
          status: floor.status,
          floorType: floor.floorType,
          maximumRoom: floor.maximumRoom,
          nameFloor: floor.nameFloor,
        });
        setIsModalOpen(true);
      } else {
        openDialog(
          { id: floor.id, type: action },
          {
            type: "warn",
            desc: action === "delete" ? Notice.REMOVE : Notice.TOGGLE_STATUS,
          }
        );
      }
    },
    [openDialog]
  );

  const { data: statistics, isError: errorStatistics } = useQuery<ApiResponse<IFloorStatisticsResponse>>({
    queryKey: ["floors-statistics"],
    queryFn: async () => {
      const res = await httpRequest.get("/floors/floor-statistics", {
        params: {
          buildingId: id,
        },
      });
      return res.data;
    },
    enabled: !!id,
  });

  const datFloors: StatisticCardType[] = [
    {
      icon: BuildingIcon,
      label: "Tầng",
      value: statistics?.data.totalFloors ?? 0,
    },
    {
      icon: CircleCheckIcon,
      label: "Hoạt động",
      value: statistics?.data.activeFloors ?? 0,
    },
    {
      icon: XCircleIcon,
      label: "Không hoạt động",
      value: statistics?.data.inactiveFloors ?? 0,
    },
  ];

  const props = {
    filterValues,
    setFilterValues,
    onClear: handleClear,
    onFilter: handleFilter,
  };

  if (isError) {
    toast.error("Có lỗi xảy ra khi tải tầng");
  }

  if (errorStatistics) {
    toast.error("Có lỗi xảy ra khi tải thống kê tầng");
  }

  return {
    query: {
      page: parsedPage,
      size: parsedSize,
      buildingId,
      floorType,
      status,
      nameFloor,
      maxRoom,
    },
    setSearchParams,
    props,
    data,
    isLoading,
    datFloors,
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
  };
};
