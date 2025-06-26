import { z } from "zod/v4";
import { useState } from "react";

export const useFormErrors = <T extends object>() => {
  //Partial: all fields are optional
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const setFieldError = (field: keyof T, message: string) => {
    setErrors((prev) => ({ ...prev, [field]: message }));
  };

  const clearErrors = () => setErrors({});

  const handleZodErrors = (error: unknown) => {
    if (error instanceof z.ZodError) {
      const newErrors: Partial<Record<keyof T, string>> = {};
      for (const issue of error.issues) {
        const field = issue.path[0] as keyof T;
        newErrors[field] = issue.message;
      }
      setErrors(newErrors);
    }
  };

  return {
    errors,
    setErrors,
    clearErrors,
    handleZodErrors,
    setFieldError,
  };
};
