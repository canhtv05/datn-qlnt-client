import axios from "axios";
import { toast } from "sonner";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { httpRequest } from "@/utils/httpRequest";
import { useAuthStore } from "@/zustand/authStore";
import cookieUtil from "@/utils/cookieUtil";
import { Status } from "@/enums";

export const useLogout = () => {
  const clearUser = useAuthStore((state) => state.clearUser);
  const navigate = useNavigate();

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
      toast.success(Status.LOGOUT_SUCCESS);
      navigate("/login");
    },
    onError: (error: Error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message ?? Status.LOGOUT_FAILED);
      } else {
        toast.error(Status.LOGOUT_FAILED);
      }
    },
  });

  const handleLogout = useCallback(() => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  return { handleLogout };
};
