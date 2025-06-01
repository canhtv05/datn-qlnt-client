import { toast } from "sonner";
import { FormEvent, useState } from "react";

import useViewport from "@/hooks/useViewport";

export const useLogin = () => {
  const { width } = useViewport();
  const [value, setValue] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const handleSubmitForm = (e: FormEvent) => {
    if (!value.email.trim() || !value.password.trim()) {
      e.preventDefault();
      toast.error("Vui lòng nhập đủ các trường.");
      return;
    }
  };

  return { width, value, setValue, handleSubmitForm };
};
