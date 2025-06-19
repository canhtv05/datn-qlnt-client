import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/zustand/authStore";

const PublicRoute = () => {
  const user = useAuthStore((state) => state.user);
  return !user?.email ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
