import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/zustand/authStore";

const PrivateRoute = () => {
  const isAuth = useAuthStore((state) => state.isAuth);

  return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
