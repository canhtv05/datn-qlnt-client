import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { emailSchema, forgotPassSchema } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";

interface ForgotPasswordValue {
  confirm: string;
  email: string;
  otp: string;
  password: string;
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isTabOTP) {
        await emailSchema.parseAsync({ email: value.email });
        clearErrors();
        toast.success("Mã OTP đã được gửi đến email của bạn");
        setIsTabOTP(false);
      } else {
        await forgotPassSchema.parseAsync(value);
        clearErrors();
        toast.success("Đổi mật khẩu thành công");
        navigate("/login");
      }
    } catch (error) {
      handleZodErrors(error);
      console.log(error, value.email);
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
  };
};
