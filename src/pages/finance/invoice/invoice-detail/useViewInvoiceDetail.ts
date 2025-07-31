import {
  ApiResponse,
  InvoiceDetailsResponse,
  PaymentCreationURL,
  PaymentReceiptResponse,
  RejectPaymentRequest,
} from "@/types";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpRequest } from "@/utils/httpRequest";
import { useCallback, useEffect, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import { useRef } from "react";
import useHighestRole from "@/hooks/useHighestRole";
import { useFormErrors } from "@/hooks";
import cookieUtil from "@/utils/cookieUtil";
import { handleMutationError } from "@/utils/handleMutationError";
import { rejectPaymentReceiptSchema } from "@/lib/validation";
import { PaymentMethod } from "@/enums";

export default function useViewInvoiceDetail() {
  const { id } = useParams();
  const role = useHighestRole();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [reason, setReason] = useState<string>("");
  const [selectPaymentMethod, setSelectPaymentMethod] = useState<PaymentMethod | string>("");

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "HoaDon_" + id,
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<RejectPaymentRequest>();

  const { data, isError, isLoading } = useQuery<ApiResponse<InvoiceDetailsResponse>>({
    queryKey: ["invoice-detail"],
    queryFn: async () => {
      const res = await httpRequest.get(`/invoices/${id}`);
      return res.data;
    },
  });

  const { data: paymentReceipt } = useQuery<ApiResponse<PaymentReceiptResponse>>({
    queryKey: ["payment-receipt-detail"],
    queryFn: async () => {
      const res = await httpRequest.get(`/payment-receipts/${data?.data?.invoiceId}`);
      return res.data;
    },
    enabled: !!data?.data?.invoiceId,
    retry: 1,
  });

  const confirmTransferPaymentMutation = useMutation({
    mutationKey: ["confirm-transfer-payment"],
    mutationFn: async (id: string) =>
      await httpRequest.patch(`/payment-receipts/confirm/${id}`, { paymentMethod: selectPaymentMethod }),
    onError: handleMutationError,
    onSuccess: () => {
      toast.success(
        switchDesc(selectPaymentMethod as PaymentMethod, "Xác nhận thanh toán bằng phương thức", "thành công")
      );
      queryClient.invalidateQueries({
        predicate: (prev) => {
          return Array.isArray(prev.queryKey) && prev.queryKey[0] === "payment-receipts";
        },
      });
    },
  });

  const handleConfirmTransferPayment = useCallback(async () => {
    const paymentReceiptId = cookieUtil.getStorage()?.paymentReceiptId;
    if (!paymentReceiptId) return false;
    try {
      await confirmTransferPaymentMutation.mutateAsync(paymentReceiptId);
      return true;
    } catch {
      return false;
    }
  }, [confirmTransferPaymentMutation]);

  const createPaymentUrlMutation = useMutation({
    mutationKey: ["create-payment-url"],
    mutationFn: async (payload: PaymentCreationURL) =>
      await httpRequest.post(`/payment-receipts/create-payment-url`, payload),
    onError: handleMutationError,
  });

  const handleContinue = useCallback(async () => {
    switch (selectPaymentMethod) {
      case PaymentMethod.CHUYEN_KHOAN: {
        if (paymentReceipt?.data?.paymentMethod !== PaymentMethod.CHUYEN_KHOAN) {
          const isConfirmed = await handleConfirmTransferPayment();
          if (isConfirmed) {
            navigate(`/invoices/payment/${data?.data?.invoiceId}?method=${selectPaymentMethod}`);
          }
        } else navigate(`/invoices/payment/${data?.data?.invoiceId}?method=${selectPaymentMethod}`);
        setSelectPaymentMethod(PaymentMethod.CHUYEN_KHOAN);
        break;
      }
      case PaymentMethod.TIEN_MAT: {
        if (paymentReceipt?.data?.paymentMethod !== PaymentMethod.TIEN_MAT) {
          handleConfirmTransferPayment();
        } else {
          toast.success(
            switchDesc(selectPaymentMethod as PaymentMethod, "Xác nhận thanh toán bằng phương thức", "thành công")
          );
        }
        setSelectPaymentMethod(PaymentMethod.TIEN_MAT);
        break;
      }
      case PaymentMethod.VNPAY: {
        if (!paymentReceipt) return;
        const data: PaymentCreationURL = {
          amount: paymentReceipt?.data?.amount,
          transactionReferenceCode: paymentReceipt?.data?.id,
        };
        createPaymentUrlMutation.mutate(data, {
          onSuccess: (data) => {
            if (data.data?.data) {
              location.href = data.data?.data;
            }
          },
        });
      }
    }
    return true;
  }, [
    createPaymentUrlMutation,
    data?.data?.invoiceId,
    handleConfirmTransferPayment,
    navigate,
    paymentReceipt,
    selectPaymentMethod,
  ]);

  useEffect(() => {
    if (isError) {
      toast.error("Có lỗi xảy ra khi xem chi tiết hóa đơn");
    }
  }, [isError]);

  useEffect(() => {
    if (role === "USER" && !cookieUtil.getStorage()?.paymentReceiptId) {
      toast.error("Không có mã phiếu thanh toán");
      navigate("/invoices", { replace: true });
    }
  }, [role, navigate]);

  const rejectPaymentMutation = useMutation({
    mutationKey: ["reject-payment"],
    mutationFn: async (id: string) => await httpRequest.patch(`/payment-receipts/reject/${id}`, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "invoice-detail",
      });
      queryClient.invalidateQueries({
        predicate: (query) => Array.isArray(query.queryKey) && query.queryKey[0] === "payment-receipt-detail",
      });

      toast.success("Từ chối toán thành công");
    },
    onError: handleMutationError,
  });

  const handleRejectPayment = useCallback(async (): Promise<boolean> => {
    try {
      await rejectPaymentReceiptSchema.parseAsync({ reason: reason.trim() });

      await rejectPaymentMutation.mutateAsync(cookieUtil.getStorage()?.paymentReceiptId);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [clearErrors, handleZodErrors, reason, rejectPaymentMutation]);

  const switchDesc = (
    type: PaymentMethod,
    descFirst = "Bạn có chắc chắn muốn thanh toán bằng phương thức",
    descLast = "không?"
  ) => {
    const descFn = (string: string) => {
      return `${descFirst} ${string} ${descLast}`;
    };

    switch (type) {
      case PaymentMethod.CHUYEN_KHOAN: {
        return descFn("chuyển khoản");
      }
      case PaymentMethod.TIEN_MAT: {
        return descFn("tiền mặt");
      }
      case PaymentMethod.VNPAY: {
        return descFn("VNPAY");
      }
      case PaymentMethod.ZALOPAY: {
        return descFn("ZALOPAY");
      }
      case PaymentMethod.MOMO: {
        return descFn("MOMO");
      }
      default:
        return descFn("chọn phương thức");
    }
  };

  return {
    handleRejectPayment,
    isLoading,
    contentRef,
    data,
    role,
    errors,
    reason,
    setReason,
    reactToPrintFn,
    handleContinue,
    setSelectPaymentMethod,
    selectPaymentMethod,
    paymentReceipt,
    switchDesc,
  };
}
