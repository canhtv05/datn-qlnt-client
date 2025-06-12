import { toast } from "sonner";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerSchema, formatFullName } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";

interface RegisterValue {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirm: string;
}

export const useRegister = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState<RegisterValue>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<RegisterValue>();

  const handleSubmitForm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      try {
        await registerSchema.parse(value);
        clearErrors();
        toast.success("Đăng ký thành công");
        navigate("/login");
      } catch (error) {
        handleZodErrors(error);
      }
    },
    [clearErrors, handleZodErrors, navigate, value]
  );

  const handleBlur = () => {
    setValue((prev) => ({
      ...prev,
      fullName: formatFullName(prev.fullName),
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue((prev) => ({
      ...prev,
      [e.target.name]: [e.target.value],
    }));
  };

  return { value, setValue, handleSubmitForm, errors, handleBlur, handleChange };
};
