import type { LucideIcon } from "lucide-react";
import type { ComponentType, ReactNode } from "react";

export type LayoutComponent = ComponentType<{ children: ReactNode }>;

export type RouteComponent = ComponentType<unknown>;

export type MenuSidebarChildType = {
  label: string;
  to: string;
  type: string;
  icon: LucideIcon;
};

export type MenuSidebarItemType = {
  label: string;
  type: string;
  children: MenuSidebarChildType[];
};

export type RouteType = {
  path: string;
  component: RouteComponent;
  layout?: null | LayoutComponent;
  children?: {
    path: string;
    component: RouteComponent;
  }[];
};
