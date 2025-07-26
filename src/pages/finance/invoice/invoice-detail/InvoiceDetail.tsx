import "@/assets/css/print.css";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/ui/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  ApiResponse,
  ColumnConfig,
  IBtnType,
  IdAndName,
  IdNameAndType,
  InvoiceDetailCreationRequest,
  InvoiceDetailsResponse,
  InvoiceDetailUpdateRequest,
  InvoiceItemResponse,
  InvoiceResponse,
  InvoiceUpdateRequest,
} from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { formattedVND } from "@/lib/utils";
import { ACTION_BUTTONS, GET_BTNS } from "@/constant";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import RenderIf from "@/components/RenderIf";
import Modal from "@/components/Modal";
import { InvoiceItemType, Notice, ServiceCategory, Status } from "@/enums";
import DataTable from "@/components/DataTable";
import buildColumnsFromConfig from "@/utils/buildColumnsFromConfig";
import { ChangeEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useConfirmDialog, useFormErrors } from "@/hooks";
import { toast } from "sonner";
import { handleMutationError } from "@/utils/handleMutationError";
import AddItemInvoiceDetail from "@/components/finance/invoice/AddItemInvoiceDetail";
import { invoiceDetailCreationSchema, invoiceDetailUpdateSchema } from "@/lib/validation";
import { z } from "zod/v4";
import { useRoomStore } from "@/zustand/invoiceStore";
import UpdateItemInvoiceDetail from "@/components/finance/invoice/UpdateItemInvoiceDetail";

const InvoiceDetail = () => {
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
      console.log(res.data);
      return {
        ...res.data,
        id: res.data.invoiceId,
      };
    },
    enabled: !!id,
    retry: 1,
  });

  const {
    data: dataServiceRoom,
    isErrorServiceRoom,
    isLoadingServiceRoom,
  } = useQuery<ApiResponse<IdNameAndType[]>>({
    queryKey: ["service-room-all"],
    queryFn: async () => {
      const res = await httpRequest.get(`/service-rooms/all/${roomId}`);
      console.log(res.data);
      return res.data;
    },
    retry: 1,
    enabled: !!roomId,
  });

  useLayoutEffect(() => {
    if (!roomId) {
      toast.error("Không có mã phòng, vui lòng thử lại");
      navigate("/finance/invoice");
    }
  }, [navigate, roomId]);

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
        toast.error("Không có ID hóa đơn");
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
      if (error instanceof z.ZodError) {
        console.log(error.message);
      }
      return false;
    }
  }, [addInvoiceDetailMutation, clearErrorsCreation, handleZodErrorsCreation, id, valueCreation]);

  const { ConfirmDialog, openDialog } = useConfirmDialog<{ id: string; type: "delete" }>({
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
        openDialog(
          { id: invoiceDetail.id, type: action },
          {
            type: "warn",
            desc: Notice.REMOVE,
          }
        );
      }
    },
    [openDialog]
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

  const { ConfirmDialog: ConfirmDialog2, openDialog: openDialog2 } = useConfirmDialog<Record<string, boolean>>({
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
        openDialog2(rowsSelection);
      }
    },
    [rowsSelection, openDialog2]
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
      if (error instanceof z.ZodError) {
        console.log(error.message);
      }
      return false;
    }
  }, [valueUpdate, updateInvoiceItemMutation, clearErrorsUpdate, queryClient, handleZodErrorsUpdate]);

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
      render: (row: InvoiceItemResponse) => {
        const category = row.serviceCategory;
        const disableBtns =
          category === ServiceCategory.TIEN_PHONG ||
          (category !== ServiceCategory.DIEN &&
            category !== ServiceCategory.NUOC &&
            category !== ServiceCategory.DEN_BU);

        return (
          <div className="flex gap-2">
            {!disableBtns &&
              GET_BTNS("update", "delete").map((btn, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
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
    {
      label: "Loại dịch vụ",
      accessorKey: "serviceCategory",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: "Cách tính",
      accessorKey: "serviceCalculation",
      isSort: true,
      hasBadge: true,
      isCenter: true,
    },
    {
      label: "Chỉ số cũ",
      accessorKey: "oldIndex",
      isSort: true,
    },
    {
      label: "Chỉ số mới",
      accessorKey: "newIndex",
      isSort: true,
    },
    {
      label: "Số lượng",
      accessorKey: "quantity",
      isSort: true,
    },
    {
      label: "Đơn vị",
      accessorKey: "unit",
      isSort: false,
    },
    {
      label: "Đơn giá",
      accessorKey: "unitPrice",
      isSort: true,
    },
    {
      label: "Thành tiền",
      accessorKey: "amount",
      isSort: true,
    },
    {
      label: "Mô tả",
      accessorKey: "description",
    },
  ];

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

  return (
    <div className="py-5 bg-white rounded-md flex flex-col">
      {/* <div className="flex justify-end">
        <Button variant={"link"}>
          <Link to={`/finance/invoice/view/${id}`}>Tải hóa đơn</Link>
        </Button>
      </div> */}
      <div className="flex justify-between items-center px-5">
        <h3 className="font-semibold md:py-0 py-3 text-2xl md:text-[16px]">Hóa đơn chi tiết</h3>
        <div className="flex gap-2">
          {ACTION_BUTTONS.filter((b) => b.type !== "upload" && b.type !== "download").map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <RenderIf value={btn.type === "default"}>
                  <Modal
                    title="Thêm hóa đơn chi tiết"
                    trigger={
                      <TooltipTrigger asChild>
                        <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                          <btn.icon className="text-white" />
                        </Button>
                      </TooltipTrigger>
                    }
                    desc={Notice.ADD}
                    onConfirm={handleAddInvoiceDetail}
                  >
                    <AddItemInvoiceDetail
                      errors={errorsCreation}
                      handleChange={handleChange("creation")}
                      serviceRooms={dataServiceRoom}
                      setValue={setValueCreation}
                      value={valueCreation}
                    />
                  </Modal>
                </RenderIf>
                <RenderIf value={btn.type === "delete"}>
                  <TooltipTrigger asChild>
                    <Button
                      size={"icon"}
                      variant={btn.type}
                      className="cursor-pointer"
                      onClick={() => handleButton(btn)}
                      disabled={btn.type === "delete" && !Object.values(rowsSelection).some(Boolean)}
                    >
                      <btn.icon className="text-white" />
                    </Button>
                  </TooltipTrigger>
                </RenderIf>
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
          <ConfirmDialog2 />
        </div>
      </div>
      <main className="mt-10">
        <DataTable<InvoiceItemResponse>
          data={data?.data?.items ?? []}
          columns={buildColumnsFromConfig(columnConfigs)}
          loading={isLoading}
          page={0}
          rowSelection={rowsSelection}
          setRowSelection={setRowsSelection}
          size={0}
          totalElements={data?.data.items.length ?? 0}
          totalPages={0}
          disablePagination
        />
      </main>
      <Modal
        title="Cập nhật hóa đơn chi tiết"
        trigger={null}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onConfirm={handleUpdateInvoiceItem}
        desc={Notice.UPDATE}
      >
        <UpdateItemInvoiceDetail
          errors={errorsUpdate}
          handleChange={handleChange("update")}
          setValue={setValueUpdate}
          type={typeRef.current}
          value={valueUpdate}
        />
      </Modal>
      <ConfirmDialog />
    </div>
  );
};

export default InvoiceDetail;
