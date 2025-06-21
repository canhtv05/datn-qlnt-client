import { toast } from "sonner";
import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { registerSchema, formatFullName } from "@/lib/validation";
import { useFormErrors } from "@/hooks/useFormErrors";
import { httpRequest } from "@/utils/httpRequest";
import { ApiResponse, UserResponse } from "@/types";
import { Status } from "@/enums";
import { handleMutationError } from "@/utils/handleMutationError";
import configs from "@/configs";

interface RegisterValue {
  fullName: string;
  phoneNumber: string;
  email: string;
  dob: string;
  gender: string;
  password: string;
  confirm: string;
  acceptPolicy: boolean;
}

export const useRegister = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState<RegisterValue>({
    fullName: "",
    phoneNumber: "",
    email: "",
    dob: "",
    gender: "MALE",
    password: "",
    confirm: "",
    acceptPolicy: false,
  });

  const { clearErrors, errors, handleZodErrors } =
    useFormErrors<RegisterValue>();

  const registerMutation = useMutation({
    mutationKey: ["register-user"],
    mutationFn: async (formValue: RegisterValue) => {
      const { confirm, acceptPolicy, ...payload } = formValue;
      const res = await httpRequest.post<ApiResponse<UserResponse>>(
        "/auth/register",
        payload
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success(Status.REGISTER_SUCCESS);
      navigate("/login");
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const handleSubmitForm = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      try {
        await registerSchema.parseAsync(value);
        clearErrors();
        registerMutation.mutate(value);
      } catch (error) {
        handleZodErrors(error);
      }
    },
    [value, clearErrors, handleZodErrors, registerMutation]
  );

  const handleBlur = () => {
    setValue((prev) => ({
      ...prev,
      fullName: formatFullName(prev.fullName),
    }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value: fieldValue, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : fieldValue;

    setValue((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleLoginWithGoogle = (e: FormEvent) => {
    e.preventDefault();

    const callbackUrl =
      configs.oauth2.redirectUri ?? "http://localhost:5173/authenticate";
    const authUrl =
      configs.oauth2.authUri ?? "https://accounts.google.com/o/oauth2/v2/auth";
    const googleClientId =
      configs.oauth2.clientId ??
      "635634641386-m0df7i4nnulj2jn27qtr0qk1l8e0hk2l.apps.googleusercontent.com";

    console.log(authUrl, callbackUrl, googleClientId);

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;

    window.location.href = targetUrl;
  };
  const handleCheckboxChange = (name: keyof typeof value, checked: boolean) => {
  setValue((prev) => ({
    ...prev,
    [name]: checked,
  }));
};


  return {
    value,
    setValue,
    handleSubmitForm,
    errors,
    handleBlur,
    handleChange,
    handleLoginWithGoogle,
    handleCheckboxChange,
  };
};

export type { RegisterValue };
