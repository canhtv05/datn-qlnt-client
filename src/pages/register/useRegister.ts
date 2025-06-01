import { toast } from "sonner";
import { FormEvent, useState } from "react";
import { z } from "zod/v4";
import { useNavigate } from "react-router-dom";

import { registerSchema, formatFullName } from "@/lib/validation";

export const useRegister = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await registerSchema.parse(value);
      setErrors({});
      toast.success("Đăng ký thành công");
      navigate("/login");
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        for (const issue of error.issues) {
          const field = issue.path[0] as string;
          newErrors[field] = issue.message;
        }
        setErrors(newErrors);
      }
    }
  };

  const handleBlur = () => {
    setValue((prev) => ({
      ...prev,
      fullName: formatFullName(prev.fullName),
    }));
  };

  return { value, setValue, handleSubmitForm, errors, handleBlur };
};
