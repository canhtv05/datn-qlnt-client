import { useNavigate } from "react-router-dom";
import { FormEvent, useCallback, useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { emailSchema } from "@/lib/validation";
import { httpRequest } from "@/utils/httpRequest";
import { ApiResponse, UserResponse } from "@/types";
import { useAuthStore } from "@/zustand/authStore";
import cookieUtil from "@/utils/cookieUtil";
import { useFormErrors } from "@/hooks/useFormErrors";
import { handleMutationError } from "@/utils/handleMutationError";
import configs from "@/configs";

interface LoginValue {
  email: string;
  password: string;
}

export const useLogin = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState<LoginValue>({
    email: "",
    password: "",
  });

  const { clearErrors, errors, handleZodErrors, setErrors } = useFormErrors<LoginValue>();

  const setUser = useAuthStore((s) => s.setUser);
  const setIsLoading = useAuthStore((s) => s.setIsLoading);

  const loginMutation = useMutation({
    mutationFn: async (): Promise<ApiResponse<UserResponse>> => {
      const data = await httpRequest.post("/auth/login", { email: value.email, password: value.password });
      return data.data;
    },
    onSuccess: (data: ApiResponse<UserResponse>) => {
      setUser(data.data, true);
      const token = {
        accessToken: data.meta?.tokenInfo?.accessToken,
        refreshToken: data.meta?.tokenInfo?.refreshToken,
      };
      cookieUtil.setStorage(token);
      navigate("/dashboard");
    },
    onError: (error) => {
      handleMutationError(error);
    },
  });

  const handleSubmitForm = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        setIsLoading(true);
        await emailSchema.parseAsync({ email: value.email });
        clearErrors();
        loginMutation.mutate();
      } catch (error) {
        handleZodErrors(error);
      } finally {
        setIsLoading(false);
      }
    },
    [clearErrors, handleZodErrors, loginMutation, setIsLoading, value.email]
  );

  const handleLoginWithGoogle = (e: FormEvent) => {
    e.preventDefault();

    const callbackUrl = configs.oauth2.redirectUri;
    const authUrl = configs.oauth2.authUri;
    const googleClientId = configs.oauth2.clientId;

    const targetUrl = `${authUrl}?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=code&client_id=${googleClientId}&scope=openid%20email%20profile`;
    window.location.href = targetUrl;
  };

  return { value, setValue, handleSubmitForm, errors, setErrors, handleLoginWithGoogle };
};
