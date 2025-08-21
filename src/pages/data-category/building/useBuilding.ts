import { StatisticCardType } from "@/components/StatisticCard";
import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { createOrUpdateBuildingSchema } from "@/lib/validation";
import {
    ApiResponse,
    BuildingResponse,
    IBuildingStatisticsResponse,
    UpdateBuildingValue,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CircleCheck, House, XCircle } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

interface FilterValues {
    query: string;
    status: string;
    buildingType: string;
}

export const useBuilding = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        page = "1",
        size = "15",
        query = "",
        status = "",
        buildingType = "",
    } = queryFilter(searchParams, "page", "size", "query", "status", "buildingType");

    const [rowSelection, setRowSelection] = useState({});
    const idRef = useRef<string>("");
    const [value, setValue] = useState<UpdateBuildingValue>({
        actualNumberOfFloors: undefined,
        address: "",
        buildingName: "",
        buildingType: undefined,
        description: "",
        numberOfFloorsForRent: undefined,
        status: undefined,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const queryClient = useQueryClient();

    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedSize = Math.max(Number(size) || 15, 1);

    const { clearErrors, errors, handleZodErrors } = useFormErrors<UpdateBuildingValue>();

    useEffect(() => {
        setFilterValues({ query, status, buildingType });
    }, [buildingType, query, status]);

    const [filterValues, setFilterValues] = useState<FilterValues>({
        query,
        status,
        buildingType,
    });

    const handleClear = () => {
        setFilterValues({ query: "", status: "", buildingType: "" });
        setSearchParams({});
    };

    const handleFilter = useCallback(() => {
        const params = new URLSearchParams();
        if (filterValues.query) params.set("query", filterValues.query);
        if (filterValues.status) params.set("status", filterValues.status);
        if (filterValues.buildingType) params.set("buildingType", filterValues.buildingType);
        params.set("page", "1");
        if (filterValues.status || filterValues.query || filterValues.buildingType) {
            setSearchParams(params);
        }
    }, [filterValues.buildingType, filterValues.query, filterValues.status, setSearchParams]);

    const { data, isLoading, isError } = useQuery<ApiResponse<BuildingResponse[]>>({
        queryKey: ["buildings", page, size, status, buildingType, query],
        queryFn: async () => {
            const params: Record<string, string> = {
                page: page.toString(),
                size: size.toString(),
            };

            if (status) params["status"] = status;
            if (buildingType) params["buildingType"] = buildingType;
            if (query) params["query"] = query;

            const res = await httpRequest.get("/buildings", {
                params,
            });

            return res.data;
        },

        retry: 1,
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.stopPropagation();
        const { name, value } = e.target;
        setValue((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const updateBuildingMutation = useMutation({
        mutationKey: ["update-building"],
        mutationFn: async (payload: UpdateBuildingValue) =>
            await httpRequest.put(`/buildings/${idRef.current}`, payload),
        onError: (error) => {
            handleMutationError(error);
        },
    });

    const removeBuildingMutation = useMutation({
        mutationKey: ["remove-building"],
        mutationFn: async (id: string) => await httpRequest.put(`/buildings/soft-delete/${id}`),
    });

    const toggleStatusBuildingMutation = useMutation({
        mutationKey: ["toggle-building"],
        mutationFn: async (id: string) => await httpRequest.put(`/buildings/toggle-status/${id}`),
    });

    const handleToggleStatusBuildingById = async (id: string): Promise<boolean> => {
        try {
            await toggleStatusBuildingMutation.mutateAsync(id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        predicate: (query) =>
                            Array.isArray(query.queryKey) && query.queryKey[0] === "buildings",
                    });
                    queryClient.invalidateQueries({ queryKey: ["building-statistics"] });

                    toast.success(t(Status.UPDATE_SUCCESS));
                },
            });
            return true;
        } catch (error) {
            handleMutationError(error);
            return false;
        }
    };

    const { ConfirmDialog, openDialog } = useConfirmDialog<{
        id: string;
        type: "delete" | "status";
    }>({
        onConfirm: async ({ id, type }) => {
            if (type === "delete") return await handleRemoveBuildingById(id);
            if (type === "status") return await handleToggleStatusBuildingById(id);
            return false;
        },
    });

    const handleRemoveBuildingById = async (id: string): Promise<boolean> => {
        try {
            await removeBuildingMutation.mutateAsync(id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        predicate: (query) =>
                            Array.isArray(query.queryKey) && query.queryKey[0] === "buildings",
                    });
                    queryClient.invalidateQueries({ queryKey: ["building-statistics"] });

                    toast.success(t(Status.REMOVE_SUCCESS));
                },
            });
            return true;
        } catch (error) {
            handleMutationError(error);
            return false;
        }
    };

    const handleUpdateBuilding = useCallback(async () => {
        try {
            const {
                actualNumberOfFloors,
                buildingName,
                buildingType,
                description,
                address,
                numberOfFloorsForRent,
                status: buildingStatus,
            } = value;

            await createOrUpdateBuildingSchema.parseAsync(value);

            const data: UpdateBuildingValue = {
                address: address.trim(),
                buildingName: buildingName.trim(),
                actualNumberOfFloors,
                buildingType,
                description: description.trim(),
                numberOfFloorsForRent,
                status: buildingStatus,
            };

            updateBuildingMutation.mutate(data, {
                onSuccess: () => {
                    setValue({
                        actualNumberOfFloors: undefined,
                        address: "",
                        buildingName: "",
                        buildingType: undefined,
                        description: "",
                        numberOfFloorsForRent: undefined,
                        status: undefined,
                    });
                    queryClient.invalidateQueries({
                        predicate: (query) =>
                            Array.isArray(query.queryKey) && query.queryKey[0] === "buildings",
                    });
                    queryClient.invalidateQueries({ queryKey: ["building-statistics"] });
                    toast.success(t(Status.UPDATE_SUCCESS));
                    setIsModalOpen(false);
                },
            });
            clearErrors();
            return true;
        } catch (error) {
            handleZodErrors(error);
            return false;
        }
    }, [value, updateBuildingMutation, clearErrors, queryClient, t, handleZodErrors]);

    const handleActionClick = useCallback(
        (building: BuildingResponse, action: "update" | "delete" | "status") => {
            idRef.current = building.id;
            if (action === "update") {
                // const parts = building.address.split(",").map((s) => s.trim());
                // const len = parts.length;
                // const wardName = parts[len - 3] || "";
                // const districtName = parts[len - 2] || "";
                // const provinceName = parts[len - 1] || "";

                // const detailedAddress = parts.slice(0, len - 3).join(", ");

                setValue({
                    actualNumberOfFloors: building.actualNumberOfFloors,
                    address: building.address,
                    buildingName: building.buildingName,
                    buildingType: building.buildingType,
                    description: building.description,
                    numberOfFloorsForRent: building.numberOfFloorsForRent,
                    status: building.status,
                });
                setIsModalOpen(true);
            } else {
                openDialog(
                    { id: building.id, type: action },
                    {
                        type: "warn",
                        desc: action === "delete" ? t(Notice.REMOVE) : t(Notice.TOGGLE_STATUS),
                    }
                );
            }
        },
        [openDialog, t]
    );

    const { data: statistics, isError: isStatisticsError } = useQuery<
        ApiResponse<IBuildingStatisticsResponse>
    >({
        queryKey: ["building-statistics"],
        queryFn: async () => {
            const res = await httpRequest.get("/buildings/statistics");
            return res.data;
        },
        retry: 1,
    });

    const dataBuildings: StatisticCardType[] = [
        {
            icon: House,
            label: t("building.title"),
            value: statistics?.data.totalBuilding ?? 0,
        },
        {
            icon: CircleCheck,
            label: t("building.response.active"),
            value: statistics?.data.activeBuilding ?? 0,
        },
        {
            icon: XCircle,
            label: t("building.response.inactive"),
            value: statistics?.data.inactiveBuilding ?? 0,
        },
    ];

    const props = {
        filterValues,
        setFilterValues,
        onClear: handleClear,
        onFilter: handleFilter,
    };

    useEffect(() => {
        if (isError) {
            toast.error(t("building.errorFetch"));
        }

        if (isStatisticsError) {
            toast.error(t("building.errorFetchStatistics"));
        }
    }, [isError, isStatisticsError, t]);

    return {
        query: {
            page: parsedPage,
            size: parsedSize,
            query,
            status,
        },
        setSearchParams,
        props,
        data,
        isLoading,
        dataBuildings,
        handleActionClick,
        rowSelection,
        setRowSelection,
        isModalOpen,
        setIsModalOpen,
        handleChange,
        handleUpdateBuilding,
        value,
        setValue,
        errors,
        ConfirmDialog,
    };
};
