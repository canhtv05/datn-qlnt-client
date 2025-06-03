import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/zustand/authStore";

const PublicRoute = () => {
  const user = useAuthStore((state) => state.user);

  // Nếu đã đăng nhập, không cho vào login/register/forgot-password
  return !user ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
