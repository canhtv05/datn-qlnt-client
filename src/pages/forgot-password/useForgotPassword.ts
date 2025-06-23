import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { emailSchema, forgotPassSchema } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import { httpRequest } from "@/utils/httpRequest";
import { handleMutationError } from "@/utils/handleMutationError";

interface ForgotPasswordValue {
  confirm: string;
  email: string;
  otp: string;
  password: string;
}

interface VerifyOTPRequest {
  email: string;
  otpCode: string;
}

interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  reNewPassword: string;
}

export const useForgotPassword = () => {
  const navigate = useNavigate();

  const [value, setValue] = useState<ForgotPasswordValue>({
    confirm: "",
    email: "",
    otp: "",
    password: "",
  });

  const [isTabOTP, setIsTabOTP] = useState(true);

  const { errors, clearErrors, handleZodErrors, setErrors } = useFormErrors<ForgotPasswordValue>();

  const MINUTE_RESEND_EMAIL = 3;
  const MINUTE_EXPIRED_OTP = 5;

  const [timeResendEmail, setTimeResendEmail] = useState<number>(MINUTE_RESEND_EMAIL * 60);
  const [timeExpiredOTP, setTimeExpiredOTP] = useState<number>(MINUTE_EXPIRED_OTP * 60);
  const [isClickSendFirstTime, setIsClickSendFirstTime] = useState<boolean>(false);

  useEffect(() => {
    if (timeResendEmail === 0) {
      setIsClickSendFirstTime(false);
      return;
    }

    const timer = setTimeout(() => {
      setTimeResendEmail((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [setTimeResendEmail, timeResendEmail]);

  useEffect(() => {
    if (timeExpiredOTP === 0) return;

    const timer = setTimeout(() => {
      setTimeExpiredOTP((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [setTimeExpiredOTP, timeExpiredOTP]);

  const forgotPasswordMutation = useMutation({
    mutationKey: ["forgot-pass"],
    mutationFn: async () => await httpRequest.post("/auth/forgot-password", { email: value.email }),
    onSuccess: () => {
      toast.success("Mã OTP đã được gửi đến email của bạn");
      setTimeResendEmail(MINUTE_RESEND_EMAIL * 60);
      setTimeExpiredOTP(MINUTE_EXPIRED_OTP * 60);
      setIsTabOTP(false);
      setValue((prev) => ({
        ...prev,
        confirm: "",
        otp: "",
        password: "",
      }));
      setIsClickSendFirstTime(true);
    },
    onError: (error) => {
      handleMutationError(error);
      setIsClickSendFirstTime(false);

      if (axios.isAxiosError(error)) {
        if (error.response?.data.message === "OTP already sent") {
          setTimeResendEmail(MINUTE_RESEND_EMAIL * 60);
          setIsClickSendFirstTime(true);
        }
      }
      setIsTabOTP(true);
    },
  });

  const handleRequestSendOTP = useCallback(() => {
    if (timeResendEmail !== 0) {
      toast.error("Chưa được phép gửi mới OTP");
      return;
    }
    forgotPasswordMutation.mutate();
  }, [forgotPasswordMutation, timeResendEmail]);

  const verifyOTPMutation = useMutation({
    mutationKey: ["verify-OTP"],
    mutationFn: async (request: VerifyOTPRequest) => await httpRequest.post("/auth/verify-otp", request),
    onError: (error) => {
      handleMutationError(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.data.message !== "OTP code is incorrect or expired.") {
          setIsTabOTP(true);
        } else {
          setIsTabOTP(false);
        }
      }
    },
  });

  const resetPasswordMutation = useMutation({
    mutationKey: ["reset-pass"],
    mutationFn: async (request: ResetPasswordRequest) => await httpRequest.post("/auth/reset-password", request),
    onError: (error) => {
      handleMutationError(error);
    },
    onSuccess: () => {
      if (!verifyOTPMutation.isError) {
        toast.success("Đổi mật khẩu thành công");
        navigate("/login");
      }
    },
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      try {
        if (isTabOTP) {
          await emailSchema.parseAsync({ email: value.email });
          forgotPasswordMutation.mutate();
        } else {
          await forgotPassSchema.parseAsync(value);
          const verifyOTPRequest: VerifyOTPRequest = {
            email: value.email,
            otpCode: value.otp,
          };
          await verifyOTPMutation.mutate(verifyOTPRequest);

          if (verifyOTPMutation.isError) return;

          const resetPasswordRequest: ResetPasswordRequest = {
            email: value.email,
            newPassword: value.password,
            reNewPassword: value.confirm,
          };
          resetPasswordMutation.mutate(resetPasswordRequest);
        }
        clearErrors();
      } catch (error) {
        handleZodErrors(error);
      }
    },
    [clearErrors, forgotPasswordMutation, handleZodErrors, isTabOTP, resetPasswordMutation, value, verifyOTPMutation]
  );

  const handleBlur = () => {
    if (value.otp.length !== 6) {
      setErrors((prev) => ({
        ...prev,
        otp: "OTP phải có 6 chữ số",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        otp: "",
      }));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return {
    handleSubmit,
    value,
    setValue,
    errors,
    setErrors,
    isTabOTP,
    handleBlur,
    handleChange,
    isClickSendFirstTime,
    timeResendEmail,
    timeExpiredOTP,
    handleRequestSendOTP,
  };
};
