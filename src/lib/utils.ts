import { RoleType } from "@/hooks/useHighestRole";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ROLE_PRIORITY: RoleType[] = ["USER", "STAFF", "MANAGER", "ADMIN"];

export const getHighestRole = (roles: RoleType[]): RoleType => {
  return roles.sort((a, b) => ROLE_PRIORITY.indexOf(b) - ROLE_PRIORITY.indexOf(a))[0];
};
