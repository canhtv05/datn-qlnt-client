import { z } from "zod/v4";
import { useNavigate } from "react-router-dom";
import { FormEvent, useState } from "react";

import { emailSchema } from "@/lib/validation";
import configs from "@/configs";

export const useLogin = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmitForm = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await emailSchema.parseAsync({ email: value.email });
      setErrors({});
      navigate("/");
      window.location.reload();
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
