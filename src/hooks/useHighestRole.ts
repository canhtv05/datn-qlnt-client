import { getHighestRole } from "@/lib/utils";
import { useAuthStore } from "@/zustand/authStore";

export type RoleType = "MANAGER" | "ADMIN" | "USER" | "STAFF";

export default function useHighestRole(): RoleType {
  const user = useAuthStore((s) => s.user);

  const userRoles = user?.roles?.map((r) => r.name as RoleType) || [];
  return getHighestRole(userRoles);
}
