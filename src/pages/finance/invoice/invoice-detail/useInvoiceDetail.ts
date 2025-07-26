import { Notice, Status } from "@/enums";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { invoiceDetailCreationSchema, invoiceDetailUpdateSchema } from "@/lib/validation";
import {
  ApiResponse,
  IBtnType,
  IdNameAndType,
  InvoiceDetailCreationRequest,
  InvoiceDetailsResponse,
  InvoiceDetailUpdateRequest,
  InvoiceItemResponse,
} from "@/types";
import { handleMutationError } from "@/utils/handleMutationError";
import { httpRequest } from "@/utils/httpRequest";
import { useRoomStore } from "@/zustand/invoiceStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function useInvoiceDetail() {
  const { id } = useParams();
  const idRef = useRef<string>("");
  const typeRef = useRef<string>("");
  const navigate = useNavigate();
  const { roomId } = useRoomStore();
  const [valueUpdate, setValueUpdate] = useState<InvoiceDetailUpdateRequest>({
    description: "",
    newIndex: undefined,
    quantity: undefined,
    unitPrice: undefined,
    serviceName: "",
  });

  const [valueCreation, setValueCreation] = useState<InvoiceDetailCreationRequest>({
    description: "",
    invoiceId: "",
    invoiceItemType: "",
    newIndex: undefined,
    quantity: undefined,
    serviceName: "",
    serviceRoomId: "",
    unitPrice: undefined,
  });

  const {
    clearErrors: clearErrorsCreation,
    errors: errorsCreation,
    handleZodErrors: handleZodErrorsCreation,
  } = useFormErrors<InvoiceDetailCreationRequest>();

  const {
    clearErrors: clearErrorsUpdate,
    errors: errorsUpdate,
    handleZodErrors: handleZodErrorsUpdate,
  } = useFormErrors<InvoiceDetailUpdateRequest>();

  const [rowsSelection, setRowsSelection] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isError, isLoading } = useQuery<ApiResponse<InvoiceDetailsResponse>>({
    queryKey: ["invoice-detail"],
    queryFn: async () => {
      const res = await httpRequest.get(`/invoices/${id}`);
      return {
        ...res.data,
        id: res.data.invoiceId,
      };
    },
    enabled: !!id,
    retry: 1,
  });

  const { data: dataServiceRoom, isError: isErrorServiceRoom } = useQuery<ApiResponse<IdNameAndType[]>>({
    queryKey: ["service-room-all"],
    queryFn: async () => {
      const res = await httpRequest.get(`/service-rooms/all/${roomId}`);
      return res.data;
    },
    retry: 1,
    enabled: !!roomId,
  });

  const location = useLocation();

  useEffect(() => {
    if (!roomId && location.pathname !== "/finance/invoice") {
      toast.error("Không có mã phòng, vui lòng thử lại");
      navigate("/finance/invoice", { replace: true });
    }
  }, [navigate, roomId, location.pathname]);

  useEffect(() => {
    if (isError) {
      toast.error("Có lỗi xảy ra khi tải hóa đơn chi tiết");
    }
    if (isErrorServiceRoom) {
      toast.error("Có lỗi xảy ra khi tải dịch vụ phòng");
    }
  }, [isError, isErrorServiceRoom]);

  const addInvoiceDetailMutation = useMutation({
    mutationKey: ["add-invoice-detail"],
    mutationFn: async (payload: InvoiceDetailCreationRequest) => await httpRequest.post(`/invoice-details`, payload),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(Status.ADD_SUCCESS);
      setValueCreation({
        description: "",
        invoiceId: "",
        invoiceItemType: "",
        newIndex: undefined,
        quantity: undefined,
        serviceName: "",
        serviceRoomId: "",
        unitPrice: undefined,
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "invoice-detail",
      });
    },
    retry: 1,
  });

  const handleAddInvoiceDetail = useCallback(async () => {
    try {
      if (!id) {
        toast.error("Không có mã hóa đơn");
        return false;
      }
      const { description, invoiceItemType, newIndex, quantity, serviceName, serviceRoomId, unitPrice } = valueCreation;

      const data: InvoiceDetailCreationRequest = {
        description: description.trim(),
        invoiceId: id,
        invoiceItemType,
        newIndex,
        quantity,
        serviceName,
        serviceRoomId: serviceRoomId.trim(),
        unitPrice,
      };

      await invoiceDetailCreationSchema.parseAsync(data);
      await addInvoiceDetailMutation.mutateAsync(data);
      clearErrorsCreation();
      return true;
    } catch (error) {
      handleZodErrorsCreation(error);
      return false;
    }
  }, [addInvoiceDetailMutation, clearErrorsCreation, handleZodErrorsCreation, id, valueCreation]);

  const { ConfirmDialog: ConfirmDialogUpdate, openDialog: openDialogUpdate } = useConfirmDialog<{
    id: string;
    type: "delete";
  }>({
    onConfirm: async ({ id, type }) => {
      if (type === "delete") return await handleRemoveInvoiceItemById(id);
      return false;
    },
  });

  const removeInvoiceMutation = useMutation({
    mutationKey: ["remove-invoice-item"],
    mutationFn: async (id: string) => await httpRequest.delete(`/invoice-details/${id}`),
  });

  const handleRemoveInvoiceItemById = async (id: string): Promise<boolean> => {
    try {
      await removeInvoiceMutation.mutateAsync(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "invoice-detail",
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

  const handleActionClick = useCallback(
    (invoiceDetail: InvoiceItemResponse, action: "update" | "delete") => {
      idRef.current = invoiceDetail.id;
      typeRef.current = invoiceDetail.serviceCategory;
      if (action === "update") {
        setValueUpdate({
          description: invoiceDetail.description,
          newIndex: invoiceDetail.newIndex,
          quantity: invoiceDetail.quantity,
          unitPrice: invoiceDetail.unitPrice,
          serviceName: invoiceDetail.serviceName,
        });
        setIsModalOpen(true);
      } else {
        openDialogUpdate(
          { id: invoiceDetail.id, type: action },
          {
            type: "warn",
            desc: Notice.REMOVE,
          }
        );
      }
    },
    [openDialogUpdate]
  );

  const handleRemoveItemsInvoiceDetailByIds = async (ids: Record<string, boolean>): Promise<boolean> => {
    try {
      const selectedIds = Object.entries(ids)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);

      await Promise.all(selectedIds.map((id) => removeInvoiceMutation.mutateAsync(id)));

      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "invoice-detail",
      });

      toast.success(Status.REMOVE_SUCCESS);
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  };

  const { ConfirmDialog: ConfirmDialogAdd, openDialog: openDialogAdd } = useConfirmDialog<Record<string, boolean>>({
    onConfirm: async (ids?: Record<string, boolean>) => {
      if (!ids || !Object.values(ids).some(Boolean)) return false;
      return await handleRemoveItemsInvoiceDetailByIds(ids);
    },
    desc: "Thao tác này sẽ xóa vĩnh viễn dữ liệu các mục đã chọn. Bạn có chắc chắn muốn tiếp tục?",
    type: "warn",
  });

  const handleButton = useCallback(
    (btn: IBtnType) => {
      if (btn.type === "delete") {
        openDialogAdd(rowsSelection);
      }
    },
    [rowsSelection, openDialogAdd]
  );

  const updateInvoiceItemMutation = useMutation({
    mutationKey: ["update-invoice-item"],
    mutationFn: async (payload: InvoiceDetailUpdateRequest) =>
      await httpRequest.put(`/invoice-details/${idRef.current}`, payload),
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const handleUpdateInvoiceItem = useCallback(async () => {
    try {
      const { description, newIndex, quantity, serviceName, unitPrice } = valueUpdate;

      const data: InvoiceDetailUpdateRequest = {
        description: description.trim(),
        newIndex,
        quantity,
        serviceName: serviceName.trim(),
        unitPrice,
      };

      await invoiceDetailUpdateSchema.parseAsync(data);

      updateInvoiceItemMutation.mutate(data, {
        onSuccess: () => {
          setValueUpdate({
            description: "",
            newIndex: undefined,
            quantity: undefined,
            serviceName: "",
            unitPrice: undefined,
          });

          queryClient.invalidateQueries({
            predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "invoice-detail",
          });

          toast.success(Status.UPDATE_SUCCESS);
          setIsModalOpen(false);
        },
      });
      clearErrorsUpdate();
      return true;
    } catch (error) {
      handleZodErrorsUpdate(error);
      return false;
    }
  }, [valueUpdate, updateInvoiceItemMutation, clearErrorsUpdate, queryClient, handleZodErrorsUpdate]);

  const handleChange = (type: "creation" | "update") => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    const { name, value } = e.target;

    if (type === "creation") {
      setValueCreation((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setValueUpdate((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const viewBtn: IBtnType[] = [
    {
      tooltipContent: "Xem hóa đơn",
      icon: Eye,
      arrowColor: "var(--color-emerald-400)",
      type: "view",
      hasConfirm: false,
    },
  ];

  return {
    handleChange,
    handleActionClick,
    handleAddInvoiceDetail,
    handleUpdateInvoiceItem,
    errorsCreation,
    errorsUpdate,
    valueCreation,
    setValueCreation,
    valueUpdate,
    setValueUpdate,
    dataServiceRoom,
    handleButton,
    rowsSelection,
    setRowsSelection,
    ConfirmDialogUpdate,
    ConfirmDialogAdd,
    data,
    isLoading,
    idRef,
    isModalOpen,
    setIsModalOpen,
    typeRef,
    id,
    navigate,
    viewBtn,
  };
}
