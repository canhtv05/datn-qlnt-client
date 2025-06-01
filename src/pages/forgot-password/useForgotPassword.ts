import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod/v4";
import { useNavigate } from "react-router-dom";

import { emailSchema, forgotPassSchema } from "@/lib/validation";

export const useForgotPassword = () => {
  const navigate = useNavigate();

  const [value, setValue] = useState({
    confirm: "",
    email: "",
    otp: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isTabOTP, setIsTabOTP] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isTabOTP) {
        await emailSchema.parseAsync({ email: value.email });
        setErrors({});
        toast.success("Mã OTP đã được gửi đến email của bạn.");
        setIsTabOTP(false);
      } else {
        await forgotPassSchema.parseAsync(value);
        setErrors({});
        toast.success("Đổi mật khẩu thành công.");
        navigate("/login");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        for (const issue of error.issues) {
          const field = issue.path[0] as string;
          if (!newErrors[field]) newErrors[field] = issue.message;
        }
        setErrors(newErrors);
      }
    }
  };

  const handleBlur = () => {
    if (value.otp.length !== 4) {
      setErrors((prev) => ({
        ...prev,
        otp: "OTP phải có 4 chữ số",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        otp: "",
      }));
    }
  };

  return {
    handleSubmit,
    value,
    setValue,
    errors,
    setErrors,
    isTabOTP,
    handleBlur,
  };
};
