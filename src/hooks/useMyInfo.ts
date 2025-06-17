import { useEffect } from "react";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { useAuthStore } from "@/zustand/authStore";
import cookieUtil from "@/utils/cookieUtil";
import { httpRequest } from "@/utils/httpRequest";

export const useMyInfo = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);
  const setIsLoading = useAuthStore((state) => state.setIsLoading);
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  const token = cookieUtil.getStorage().accessToken;

  const { isLoading, isError } = useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      const res = await httpRequest.get("/users/me");
      setUser(res.data.data, true);
      return res.data.data;
    },
    enabled: !!token && location.pathname !== "/authenticate" && !user,
    staleTime: 5 * 6 * 1000,
    retry: false,
  });

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  useEffect(() => {
    if (location.pathname === "/authenticate") return;

    if (!token) {
      cookieUtil.deleteStorage();
      clearUser();
      // navigate("/login");
      return;
    }

    if (isError) {
      toast.error("Phiên đăng nhập hết hạn");
      clearUser();
      cookieUtil.deleteStorage();
    }
  }, [clearUser, isError, location.pathname, token]);
};
