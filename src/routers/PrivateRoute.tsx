import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "@/zustand/authStore";

const PrivateRoute = () => {
  const user = useAuthStore((state) => state.user);

  // Nếu chưa đăng nhập thì chuyển sang login
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
