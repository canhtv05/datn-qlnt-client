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

  useEffect(() => {
    const token = cookieUtil.getStorage().accessToken;

    if (!token) {
      cookieUtil.deleteStorage();
      clearUser();
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await httpRequest.get(`/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(res.data.data);
      } catch {
        toast.error("Phiên đăng nhập hết hạn");
        clearUser();
        cookieUtil.deleteStorage();
        navigate("/login");
      }
    };

    fetchUser();
  }, [clearUser, navigate, setUser]);
};
