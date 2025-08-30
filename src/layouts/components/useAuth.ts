import axios from "axios";
import { toast } from "sonner";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { httpRequest } from "@/utils/httpRequest";
import { useAuthStore } from "@/zustand/authStore";
import cookieUtil from "@/utils/cookieUtil";
import { Status } from "@/enums";
import { handleMutationError } from "@/utils/handleMutationError";
import { useTranslation } from "react-i18next";
import { ChangePasswordRequest } from "@/types";
import { useFormErrors } from "@/hooks";
import { changePassSchema } from "@/lib/validation";

export const useAuth = () => {
  const clearUser = useAuthStore((state) => state.clearUser);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [value, setValue] = useState<ChangePasswordRequest>({
    newPassword: "",
    oldPassword: "",
    reNewPassword: "",
  });

  const { clearErrors, errors, handleZodErrors } = useFormErrors<ChangePasswordRequest>();

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

  const changePasswordMutation = useMutation({
    mutationKey: ["change-pass"],
    mutationFn: async (payload: ChangePasswordRequest) => await httpRequest.post(`/auth/change-password`, payload),
    onSuccess: () => {
      setValue({
        newPassword: "",
        oldPassword: "",
        reNewPassword: "",
      });
    },
    onError: handleMutationError,
  });

  const handleChangePassword = useCallback(async () => {
    try {
      const { newPassword, oldPassword, reNewPassword } = value;

      const data = {
        newPassword: newPassword.trim(),
        oldPassword: oldPassword.trim(),
        reNewPassword: reNewPassword.trim(),
      };

      await changePassSchema.parseAsync(data);
      await changePasswordMutation.mutateAsync(data);
      clearErrors();
      return true;
    } catch (error) {
      handleZodErrors(error);
      return false;
    }
  }, [changePasswordMutation, clearErrors, handleZodErrors, value]);

  return { handleLogout, handleChangePassword, value, setValue, isModalOpen, setIsModalOpen, errors };
};
