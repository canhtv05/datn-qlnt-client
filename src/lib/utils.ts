import { RoleType } from "@/hooks/useHighestRole";
import { useEditorStore } from "@/zustand/editorStore";
import { FindResultType } from "ckeditor5";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ROLE_PRIORITY: RoleType[] = ["USER", "STAFF", "MANAGER", "ADMIN"];

export const getHighestRole = (roles: RoleType[]): RoleType => {
  return roles.sort((a, b) => ROLE_PRIORITY.indexOf(b) - ROLE_PRIORITY.indexOf(a))[0];
};

export const formattedVND = (price: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export const switchGrid3 = (type: "default" | "restore"): string => {
  switch (type) {
    case "default":
      return "grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end";
    default:
      return "grid md:grid-cols-2 grid-cols-1 gap-5 w-full items-end";
  }
};

export const switchGrid4 = (type: "default" | "restore"): string => {
  switch (type) {
    case "default":
      return "grid md:grid-cols-4 grid-cols-1 gap-5 w-full items-end";
    default:
      return "grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end";
  }
};

export const switchGrid2 = (type: "default" | "restore"): string => {
  switch (type) {
    case "default":
      return "grid md:grid-cols-2 grid-cols-1 gap-5 w-full items-end";
    default:
      return "grid md:grid-cols-1 grid-cols-1 gap-5 w-full items-end";
  }
};

export const replaceText = (replacementText: string, findResult: FindResultType) => {
  const editor = useEditorStore.getState().getEditor();
  if (!editor) return;

  editor.execute("replace", replacementText, findResult);
};

export const;
