import { Notice, Status } from "@/enums";
import { useConfirmDialog } from "@/hooks";
import { ApiResponse, RoomResponse, FilterRoomValues, FloorResponse, IBtnType } from "@/types";
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

export const useHistoryRoom = () => {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const {
        page = "1",
        size = "15",
        status = "",
        maxPrice = "",
        minPrice = "",
        maxAcreage = "",
        minAcreage = "",
        maximumPeople = "",
        nameFloor = "",
        buildingId = "",
        floorId = "",
    } = queryFilter(
        searchParams,
        "page",
        "size",
        "status",
        "maxPrice",
        "minPrice",
        "maxAcreage",
        "minAcreage",
        "maximumPeople",
        "nameFloor",
        "buildingId",
        "floorId"
    );

    const { id } = useParams();
    const navigate = useNavigate();

    const [rowSelection, setRowSelection] = useState({});
    const idRef = useRef<string>("");

    const queryClient = useQueryClient();

    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedSize = Math.max(Number(size) || 15, 1);

    const [filterValues, setFilterValues] = useState<FilterRoomValues>({
        status,
        maxPrice,
        minPrice,
        maxAcreage,
        minAcreage,
        maximumPeople,
        nameFloor,
        buildingId: buildingId || id || "",
        floorId,
    });

    const handleClear = () => {
        setFilterValues({
            status: "",
            maxPrice: "",
            minPrice: "",
            maxAcreage: "",
            minAcreage: "",
            maximumPeople: "",
            nameFloor: "",
            buildingId: id || "",
            floorId: "",
        });
        setSearchParams({});
    };

    const handleFilter = useCallback(() => {
        const params = new URLSearchParams();
        Object.entries(filterValues).forEach(([key, val]) => {
            if (val) params.set(key, val);
        });
        params.set("page", "1");

        if (filterValues.buildingId) {
            const query = params.toString();
            navigate(`/facilities/rooms/history/${filterValues.buildingId}?${query}`);
        } else {
            setSearchParams(params);
        }
    }, [filterValues, navigate, setSearchParams]);

    const { data, isLoading, isError } = useQuery<ApiResponse<FloorResponse[]>>({
        queryKey: [
            "rooms-cancel",
            page,
            size,
            status,
            buildingId,
            id,
            minAcreage,
            maxAcreage,
            minPrice,
            maxPrice,
            maximumPeople,
            nameFloor,
            floorId,
        ],
        queryFn: async () => {
            const params: Record<string, string> = {
                page: parsedPage.toString(),
                size: parsedSize.toString(),
            };
            Object.entries(filterValues).forEach(([k, v]) => {
                if (v) params[k] = v;
            });

            if (id) params["buildingId"] = id;

            const res = await httpRequest.get("/rooms/cancel", {
                params,
            });

            return res.data;
        },
        retry: 1,
        enabled: !!id,
    });

    const removeRoomMutation = useMutation({
        mutationKey: ["remove-room"],
        mutationFn: async (id: string) => await httpRequest.delete(`/rooms/delete/${id}`),
    });

    const handleRemoveRoomById = async (id: string): Promise<boolean> => {
        try {
            await removeRoomMutation.mutateAsync(id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        predicate: (query) =>
                            Array.isArray(query.queryKey) && query.queryKey[0] === "rooms",
                    });
                    queryClient.invalidateQueries({
                        predicate: (query) =>
                            Array.isArray(query.queryKey) && query.queryKey[0] === "rooms-cancel",
                    });
                    queryClient.invalidateQueries({ queryKey: ["room-statistics"] });

                    toast.success(t(Status.REMOVE_SUCCESS));
                },
            });
            return true;
        } catch (error) {
            handleMutationError(error);
            return false;
        }
    };

    const restoreRoomMutation = useMutation({
        mutationKey: ["restore-room"],
        mutationFn: async (id: string) => await httpRequest.put(`/rooms/restore/${id}`),
    });

    const handleRestoreRoomById = async (id: string): Promise<boolean> => {
        try {
            await restoreRoomMutation.mutateAsync(id, {
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        predicate: (query) =>
                            Array.isArray(query.queryKey) && query.queryKey[0] === "rooms",
                    });
                    queryClient.invalidateQueries({
                        predicate: (query) =>
                            Array.isArray(query.queryKey) && query.queryKey[0] === "rooms-cancel",
                    });
                    queryClient.invalidateQueries({ queryKey: ["room-statistics"] });

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
                return await handleRemoveRoomById(id);
            } else {
                return await handleRestoreRoomById(id);
            }
        },
    });

    const { ConfirmDialog: ConfirmDialogRemoveAll, openDialog: openDialogAll } =
        useConfirmDialog<BulkRemovePayload>({
            onConfirm: async ({ ids, type }) => {
                if (!ids || !Object.values(ids).some(Boolean)) return false;
                if (type === "remove") {
                    return await handleRemoveRoomByIds(ids);
                } else {
                    return await handleRestoreRoomByIds(ids);
                }
            },
        });

    const handleRemoveRoomByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
        try {
            const selectedIds = Object.entries(ids)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, isSelected]) => isSelected)
                .map(([id]) => id);

            await Promise.all(selectedIds.map((id) => removeRoomMutation.mutateAsync(id)));

            queryClient.invalidateQueries({
                predicate: (query) =>
                    Array.isArray(query.queryKey) && query.queryKey[0] === "rooms",
            });
            queryClient.invalidateQueries({
                predicate: (query) =>
                    Array.isArray(query.queryKey) && query.queryKey[0] === "rooms-cancel",
            });
            queryClient.invalidateQueries({ queryKey: ["room-statistics"] });

            toast.success(t(Status.REMOVE_SUCCESS));
            setRowSelection({});
            return true;
        } catch (error) {
            handleMutationError(error);
            return false;
        }
    };

    const handleRestoreRoomByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
        try {
            const selectedIds = Object.entries(ids)
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                .filter(([_, isSelected]) => isSelected)
                .map(([id]) => id);

            await Promise.all(selectedIds.map((id) => restoreRoomMutation.mutateAsync(id)));

            queryClient.invalidateQueries({
                predicate: (query) =>
                    Array.isArray(query.queryKey) && query.queryKey[0] === "rooms",
            });
            queryClient.invalidateQueries({
                predicate: (query) =>
                    Array.isArray(query.queryKey) && query.queryKey[0] === "rooms-cancel",
            });
            queryClient.invalidateQueries({ queryKey: ["room-statistics"] });

            toast.success(t(Status.RESTORE_SUCCESS));
            setRowSelection({});
            return true;
        } catch (error) {
            handleMutationError(error);
            return false;
        }
    };

    const handleActionClick = useCallback(
        (room: RoomResponse, type: IBtnType["type"]) => {
            idRef.current = room.id;
            if (type === "delete") {
                openDialog(
                    { id: room.id, type: "remove" },
                    {
                        type: "warn",
                        desc: t(Notice.REMOVE),
                    }
                );
            } else {
                openDialog(
                    { id: room.id, type: "restore" },
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
            toast.error(t("room.errorFetch"));
        }
    }, [isError, t]);

    return {
        query: { page: parsedPage, size: parsedSize, ...filterValues },
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
