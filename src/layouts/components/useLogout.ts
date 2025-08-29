import axios from "axios";
import { toast } from "sonner";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { httpRequest } from "@/utils/httpRequest";
import { useAuthStore } from "@/zustand/authStore";
import cookieUtil from "@/utils/cookieUtil";
import { Status } from "@/enums";
import { handleMutationError } from "@/utils/handleMutationError";
import { useTranslation } from "react-i18next";

export const useLogout = () => {
  const clearUser = useAuthStore((state) => state.clearUser);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: async () =>
      await httpRequest.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${cookieUtil.getStorage()?.accessToken}`,
          },
        }
      ),
    onSuccess: () => {
      cookieUtil.deleteStorage();
      clearUser();
      toast.success(t(Status.LOGOUT_SUCCESS));
      navigate("/login");
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? t(Status.LOGOUT_FAILED));
      } else {
        toast.error(t(Status.LOGOUT_FAILED));
      }
    },
  });

  const handleLogout = useCallback(async () => {
    try {
      await logoutMutation.mutate();
      return true;
    } catch (error) {
      handleMutationError(error);
      return false;
    }
  }, [logoutMutation]);

  return { handleLogout };
};
