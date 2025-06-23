import { z } from "zod/v4";
import { toast } from "sonner";
import { useState } from "react";

import { Status } from "@/enums";

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
    } else {
      toast.error(Status.ERROR);
    }
    throw error;
  };

  return {
    errors,
    setErrors,
    clearErrors,
    handleZodErrors,
    setFieldError,
  };
};
