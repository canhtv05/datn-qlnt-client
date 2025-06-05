import { useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import { useAuthStore } from "@/zustand/authStore";
import cookieUtil from "@/utils/cookieUtil";
import { httpRequest } from "@/utils/httpRequest";

export const useMyInfo = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const token = cookieUtil.getStorage().accessToken;

    if (!token) {
      cookieUtil.deleteStorage();
      clearUser();
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await httpRequest.get(`/auth/me`);
        setUser(res.data.data, true);
      } catch {
        toast.error("Phiên đăng nhập hết hạn");
        clearUser();
        cookieUtil.deleteStorage();
      } finally {
        setIsLoading(false);
      }
    };

    if (!user) fetchUser();
  }, [clearUser, navigate, setIsLoading, setUser, user]);
};
