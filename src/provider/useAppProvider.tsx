import { ComponentType, Fragment, ReactNode } from "react";
import { Route, useLocation } from "react-router-dom";

import DefaultLayout from "@/layouts/DefaultLayout";
import { useAuthStore } from "@/zustand/authStore";
import useHighestRole, { RoleType } from "@/hooks/useHighestRole";
import { checkUser } from "@/lib/utils";
import UpdateProfile from "@/components/UpdateProfile";
import { publicRoutes } from "@/routers/router";

type LayoutComponent = ComponentType<{ children: ReactNode }>;

type RouteComponent = ComponentType<unknown>;

export interface RouteType {
  path: string;
  component: RouteComponent;
  layout?: null | LayoutComponent;
  children?: {
    path: string;
    component: RouteComponent;
  }[];
  allowedRoles?: RoleType[];
}

export const useAppProvider = () => {
  const location = useLocation();
  const background = location.state && location.state.background;
  const { user, isLoading } = useAuthStore((s) => s);
  const highestRole = useHighestRole();

  const loadRoute = (route: RouteType, index: number) => {
    if (route.allowedRoles && user?.roles) {
      if (!route.allowedRoles.includes(highestRole)) return null;
    }

    let Page = route.component;
    if (checkUser(user, isLoading) === false && publicRoutes.every((p) => p.path !== location.pathname))
      Page = UpdateProfile;
    let Layout: LayoutComponent = DefaultLayout;

    if (route.layout === null) Layout = Fragment;
    else if (route.layout) Layout = route.layout;

    return (
      <Route
        key={index}
        path={route.path}
        element={
          <Layout>
            <Page />
          </Layout>
        }
      >
        {route.children?.map((child, index) => {
          const ChildPage = child.component;
          return <Route key={index} path={child.path} element={<ChildPage />} />;
        })}
      </Route>
    );
  };

  const loadModalRoute = (route: RouteType, index: number) => {
    const Page = route.component;
    return <Route key={index} path={route.path} element={<Page />} />;
  };

  return {
    loadModalRoute,
    loadRoute,
    background,
    location,
    isLoading,
  };
};
