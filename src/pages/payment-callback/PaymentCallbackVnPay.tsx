import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Check, CircleAlert, Loader } from "lucide-react";

import { httpRequest } from "@/utils/httpRequest";
import RenderIf from "@/components/RenderIf";
import { PaymentMethod, Status } from "@/enums";
import { handleMutationError } from "@/utils/handleMutationError";
import { ApiResponse, PaymentMethodResponse } from "@/types";

const PaymentCallbackVnPay = () => {
  const navigate = useNavigate();
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const [searchParams] = useSearchParams();
  const responseCode = searchParams.get("vnp_ResponseCode");
  const transactionReferenceCode = searchParams.get("vnp_TxnRef")?.split("_")[0];

  const { data, error } = useQuery({
    queryKey: ["payment-callback", responseCode, transactionReferenceCode],
    queryFn: () =>
      httpRequest.patch<ApiResponse<PaymentMethodResponse>>(`/payment-receipts/confirm/${transactionReferenceCode}`, {
        paymentMethod: PaymentMethod.VNPAY,
      }),
    enabled: !!responseCode && !!transactionReferenceCode,
    retry: false,
  });

  useEffect(() => {
    if (!responseCode || !transactionReferenceCode) {
      toast.error(Status.ERROR);
      navigate("/room");
    }
  }, [navigate, responseCode, transactionReferenceCode]);

  useEffect(() => {
    if (data) {
      setShowSuccessScreen(true);
      const timer = setTimeout(() => {
        navigate("/payment-receipts");
        toast.success("Thanh toán bằng VNPAY thành công");
      }, 1000);

      return () => clearTimeout(timer);
    } else if (error) {
      navigate("/payment-receipts");
      handleMutationError(error);
    }
  }, [data, error, navigate]);

  let paymentStatus: "pending" | "success" | "error" = "pending";
  if (error) paymentStatus = "error";
  else if (data) paymentStatus = "success";

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="w-full max-w-md p-8 rounded-xl bg-white/80 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col items-center space-y-6">
          <RenderIf value={paymentStatus === "pending"}>
            <div className="animate-spin text-primary">
              <Loader className="w-10 h-10" aria-label="Loading" />
            </div>
          </RenderIf>

          <RenderIf value={paymentStatus === "error"}>
            <div className="text-red-500">
              <CircleAlert className="w-10 h-10" aria-label="Error" />
            </div>
          </RenderIf>

          <RenderIf value={paymentStatus === "success" && showSuccessScreen}>
            <div className="text-primary">
              <Check className="w-10 h-10" aria-label="Success" />
            </div>
          </RenderIf>

          <div className="text-center space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">
              <RenderIf value={paymentStatus === "pending"}>Đang thanh toán</RenderIf>
              <RenderIf value={paymentStatus === "error"}>Lỗi</RenderIf>
              <RenderIf value={paymentStatus === "success" && showSuccessScreen}>
                <span className="text-primary">Thanh toán thành công!</span>
              </RenderIf>
            </h2>
            <p className="text-sm text-gray-600">
              {paymentStatus === "error"
                ? "Vui lòng thử lại hoặc liên hệ với hỗ trợ nếu vấn đề vẫn còn."
                : paymentStatus === "success" && showSuccessScreen
                ? "Chuyển hướng trong giây lát..."
                : "Vui lòng đợi trong khi chúng tôi thanh toán."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCallbackVnPay;
