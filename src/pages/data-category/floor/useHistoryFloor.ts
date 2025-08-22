import { Notice, Status } from "@/enums";
import { useConfirmDialog } from "@/hooks";
import { ApiResponse, FloorFilterValues, FloorResponse, IBtnType } from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { queryFilter } from "@/utils/queryFilter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

type BulkRemovePayload = {
    ids: Record<string, boolean>;
    type: "remove" | "undo";
};

export const useHistoryFloor = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        page = "1",
        size = "15",
        status = "",
        floorType = "",
        nameFloor = "",
        buildingId = "",
        maxRoom = "",
    } = queryFilter(
        searchParams,
        "page",
        "size",
        "buildingId",
        "status",
        "floorType",
        "nameFloor",
        "maxRoom"
    );

    const { id } = useParams();
    const navigate = useNavigate();

    const [rowSelection, setRowSelection] = useState({});
    const idRef = useRef<string>("");

    const queryClient = useQueryClient();

    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedSize = Math.max(Number(size) || 15, 1);

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
                navigate(`/facilities/floors/history/${filterValues.buildingId}?${query}`);
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
        queryKey: [
            "floors-cancel",
            page,
            size,
            status,
            buildingId,
            id,
            maxRoom,
            nameFloor,
            floorType,
        ],
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

            const res = await httpRequest.get("/floors/cancel", {
                params,
            });

            return res.data;
        },
        retry: 1,
        enabled: !!id,
    });

    const removeFloorMutation = useMutation({
        mutationKey: ["remove-floor"],
        mutationFn: async (id: string) => await httpRequest.delete(`/floors/${id}`),
    });

    const handleRemoveFloorById = async (id: string): Promise<boolean> => {
        try {
            await removeFloorMutation.mutateAsync(id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        predicate: (query) =>
                            Array.isArray(query.queryKey) && query.queryKey[0] === "floors",
                    });
                    queryClient.invalidateQueries({
                        predicate: (query) =>
                            Array.isArray(query.queryKey) && query.queryKey[0] === "floors-cancel",
                    });
                    queryClient.invalidateQueries({ queryKey: ["floors-statistics"] });

                    toast.success(t(Status.REMOVE_SUCCESS));
                },
            });
            return true;
        } catch (error) {
            handleMutationError(error);
            return false;
        }
    };

    const restoreFloorMutation = useMutation({
        mutationKey: ["restore-floor"],
        mutationFn: async (id: string) => await httpRequest.put(`/floors/restore/${id}`),
    });

    const handleRestoreFloorById = async (id: string): Promise<boolean> => {
        try {
            await restoreFloorMutation.mutateAsync(id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        predicate: (query) =>
                            Array.isArray(query.queryKey) && query.queryKey[0] === "floors",
                    });
                    queryClient.invalidateQueries({
                        predicate: (query) =>
                            Array.isArray(query.queryKey) && query.queryKey[0] === "floors-cancel",
                    });
                    queryClient.invalidateQueries({ queryKey: ["floors-statistics"] });

                    toast.success(t(Status.RESTORE_SUCCESS));
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
        type: "restore" | "remove";
    }>({
        onConfirm: async ({ id, type }) => {
            if (type === "remove") {
                return await handleRemoveFloorById(id);
            } else {
                return await handleRestoreFloorById(id);
            }
        },
    });

    const { ConfirmDialog: ConfirmDialogRemoveAll, openDialog: openDialogAll } =
        useConfirmDialog<BulkRemovePayload>({
            onConfirm: async ({ ids, type }) => {
                if (!ids || !Object.values(ids).some(Boolean)) return false;
                if (type === "remove") {
                    return await handleRemoveFloorByIds(ids);
                } else {
                    return await handleRestoreFloorByIds(ids);
                }
            },
        });

    const handleRemoveFloorByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
        try {
            const selectedIds = Object.entries(ids)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, isSelected]) => isSelected)
                .map(([id]) => id);

            await Promise.all(selectedIds.map((id) => removeFloorMutation.mutateAsync(id)));

            queryClient.invalidateQueries({
                predicate: (query) =>
                    Array.isArray(query.queryKey) && query.queryKey[0] === "floors",
            });
            queryClient.invalidateQueries({
                predicate: (query) =>
                    Array.isArray(query.queryKey) && query.queryKey[0] === "floors-cancel",
            });
            queryClient.invalidateQueries({ queryKey: ["floors-statistics"] });

            toast.success(t(Status.REMOVE_SUCCESS));
            setRowSelection({});
            return true;
        } catch (error) {
            handleMutationError(error);
            return false;
        }
    };

    const handleRestoreFloorByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
        try {
            const selectedIds = Object.entries(ids)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, isSelected]) => isSelected)
                .map(([id]) => id);

            await Promise.all(selectedIds.map((id) => restoreFloorMutation.mutateAsync(id)));

            queryClient.invalidateQueries({
                predicate: (query) =>
                    Array.isArray(query.queryKey) && query.queryKey[0] === "floors",
            });
            queryClient.invalidateQueries({
                predicate: (query) =>
                    Array.isArray(query.queryKey) && query.queryKey[0] === "floors-cancel",
            });
            queryClient.invalidateQueries({ queryKey: ["floors-statistics"] });

            toast.success(t(Status.RESTORE_SUCCESS));
            setRowSelection({});
            return true;
        } catch (error) {
            handleMutationError(error);
            return false;
        }
    };

    const handleActionClick = useCallback(
        (floor: FloorResponse, type: IBtnType["type"]) => {
            idRef.current = floor.id;
            if (type === "delete") {
                openDialog(
                    { id: floor.id, type: "remove" },
                    {
                        type: "warn",
                        desc: t(Notice.REMOVE),
                    }
                );
            } else {
                openDialog(
                    { id: floor.id, type: "restore" },
                    {
                        type: "default",
                        desc: t(Notice.RESTORE),
                    }
                );
            }
        },
        [openDialog, t]
    );

    const props = {
        filterValues,
        setFilterValues,
        onClear: handleClear,
        onFilter: handleFilter,
    };

    useEffect(() => {
        if (isError) {
            toast.error(t("floor.errorFetch"));
        }
    }, [isError, t]);

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
        handleActionClick,
        rowSelection,
        setRowSelection,
        ConfirmDialog,
        ConfirmDialogRemoveAll,
        openDialogAll,
    };
};
