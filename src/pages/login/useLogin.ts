import { z } from "zod/v4";
import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import { emailSchema } from "@/lib/validation";
import configs from "@/configs";
import { httpRequest } from "@/utils/httpRequest";
import { ApiResponse, UserResponse } from "@/types";
import { useAuthStore } from "@/zustand/authStore";
import cookieUtil from "@/utils/cookieUtil";
import { Status } from "@/enums";

export const useLogin = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      navigate("/");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else {
        toast.error(Status.ERROR);
      }
    },
  });

  const handleSubmitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await emailSchema.parseAsync({ email: value.email });
      setErrors({});
      loginMutation.mutate();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        for (const issue of error.issues) {
          const field = issue.path[0] as string;
          newErrors[field] = issue.message;
        }
        setErrors(newErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
