import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/zustand/authStore";
import LoadingPage from "@/components/LoadingPage";

const PrivateRoute = () => {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) return <LoadingPage />;
  return user?.email && !isLoading ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
