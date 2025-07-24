import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/zustand/authStore";
import { RoleType } from "@/hooks/useHighestRole";
import { getHighestRole } from "@/lib/utils";

const PublicRoute = () => {
  const user = useAuthStore((state) => state.user);

  if (!user || !user.email) {
    return <Outlet />;
  }

  const roles: RoleType[] = user.roles.map((r) => r.name as RoleType);
  const highestRole = getHighestRole(roles);

  return <Navigate to={highestRole === "USER" ? "/room" : "/dashboard"} replace />;
};

export default PublicRoute;
