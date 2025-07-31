import { Notice, Status } from "@/enums";
import { useConfirmDialog } from "@/hooks";
import { ApiResponse, ServiceLittleResponse, ServiceRoomDetailResponse, ServiceUpdateUnitPriceRequest } from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export const useServiceRoomDetail = () => {
  const { roomId } = useParams();
  const [rowSelection, setRowSelection] = useState({});
  const idRef = useRef<string>("");
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState<ServiceUpdateUnitPriceRequest>({
    buildingId: searchParams.get("buildingId") ?? "",
    newUnitPrice: undefined,
    serviceId: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // const { clearErrors, errors, handleZodErrors } = useFormErrors<ServiceUpdateUnitPriceRequest>();

  const { data, isLoading, isError } = useQuery<ApiResponse<ServiceRoomDetailResponse>>({
    queryKey: ["service-rooms-detail"],
    queryFn: async () => {
      const res = await httpRequest.get(`/service-rooms/${roomId}`);

      return res.data;
    },
    enabled: !!roomId,
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

  const removeServiceRoomMutation = useMutation({
    mutationKey: ["remove-service-rooms"],
    mutationFn: async (id: string) => await httpRequest.delete(`/service-rooms/${id}`),
  });

  const toggleStatusServiceRoomMutation = useMutation({
    mutationKey: ["toggle-service-room"],
    mutationFn: async (id: string) => await httpRequest.put(`/service-rooms/toggle-status/${id}`),
  });

  const handleToggleStatusServiceRoomById = async (id: string): Promise<boolean> => {
    try {
      await toggleStatusServiceRoomMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms-detail",
          });
          queryClient.invalidateQueries({ queryKey: ["service-rooms-statistics"] });

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
      if (type === "delete") return await handleRemoveServiceRoomById(id);
      if (type === "status") return await handleToggleStatusServiceRoomById(id);
      return false;
    },
  });

  const { ConfirmDialog: ConfirmDialogRemoveAll, openDialog: openDialogAll } = useConfirmDialog<
    Record<string, boolean>
  >({
    onConfirm: async (ids?: Record<string, boolean>) => {
      if (!ids || !Object.values(ids).some(Boolean)) return false;
      return await handleRemoveServiceRoomTypeByIds(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các dịch vụ phòng đã chọn. Bạn có chắc chắn muốn tiếp tục?",
    type: "warn",
  });

  const handleRemoveServiceRoomById = async (id: string): Promise<boolean> => {
    try {
      await removeServiceRoomMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms",
          });
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms-detail",
          });
          queryClient.invalidateQueries({ queryKey: ["service-rooms-statistics"] });
          toast.success(Status.REMOVE_SUCCESS);
        },
      });
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  // const updateServiceRoomMutation = useMutation({
  //   mutationKey: ["update-service-room"],
  //   mutationFn: async (payload: ServiceUpdateUnitPriceRequest) =>
  //     await httpRequest.put(`/service-rooms/serviceId/${idRef.current}/buildingId/${value.buildingId}`, payload),
  //   onError: (error) => {
  //     handleMutationError(error);
  //   },
  // });

  // const handleUpdateServiceRoom = useCallback(async () => {
  //   try {
  //     const { buildingId, newUnitPrice } = value;

  //     const data: ServiceUpdateUnitPriceRequest = {
  //       buildingId,
  //       newUnitPrice,
  //       serviceId: idRef.current,
  //     };

  //     if (!data.buildingId) {
  //       toast.error("Không có mã tòa nhà");
  //       return false;
  //     }

  //     if (!data.serviceId) {
  //       toast.error("Không có mã dịch vụ");
  //       return false;
  //     }

  //     await updateServicePriceInBuildingSchema.parseAsync(data);

  //     updateServiceRoomMutation.mutate(data, {
  //       onSuccess: () => {
  //         setValue({
  //           buildingId: "",
  //           newUnitPrice: undefined,
  //           serviceId: "",
  //         });
  //         queryClient.invalidateQueries({
  //           predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms",
  //         });
  //         queryClient.invalidateQueries({
  //           predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms-detail",
  //         });
  //         queryClient.invalidateQueries({ queryKey: ["service-rooms-statistics"] });
  //         toast.success(Status.UPDATE_SUCCESS);
  //         setIsModalOpen(false);
  //       },
  //     });
  //     clearErrors();
  //     return true;
  //   } catch (error) {
  //     handleZodErrors(error);
  //     return false;
  //   }
  // }, [updateServiceRoomMutation, clearErrors, handleZodErrors, queryClient, value]);

  const handleActionClick = useCallback(
    (serviceRoom: ServiceLittleResponse, action: "delete" | "status") => {
      idRef.current = serviceRoom.id;
      openDialog(
        { id: serviceRoom.id, type: action },
        {
          type: "warn",
          desc: action === "delete" ? Notice.REMOVE : Notice.TOGGLE_STATUS,
        }
      );
    },
    [openDialog]
  );

  const handleRemoveServiceRoomTypeByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeServiceRoomMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "service-rooms-detail",
      });
      queryClient.invalidateQueries({ queryKey: ["service-rooms-statistics"] });

      toast.success(Status.REMOVE_SUCCESS);
      setRowSelection({});
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  useEffect(() => {
    if (isError) {
      toast.error("Có lỗi xảy ra khi tải chi tiết dịch vụ trong phòng");
    }
  }, [isError]);

  return {
    data,
    isLoading,
    rowSelection,
    setRowSelection,
    isModalOpen,
    setIsModalOpen,
    ConfirmDialog,
    handleActionClick,
    handleChange,
    // errors,
    value,
    handleRemoveServiceRoomTypeByIds,
    openDialog,
    openDialogAll,
    ConfirmDialogRemoveAll,
  };
};
