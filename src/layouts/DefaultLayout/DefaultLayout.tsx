import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import { AppSidebar } from "../components/AppSidebar";
import HeaderLayout from "../components/HeaderLayout";
import { useLocation } from "react-router-dom";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import { RoleType } from "@/hooks/useHighestRole";
import { useAuthStore } from "@/zustand/authStore";
import { checkUser, getHighestRole } from "@/lib/utils";
import RenderIf from "@/components/RenderIf";
// import FooterLayout from "../components/FooterLayout";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { user, isLoading } = useAuthStore();
  const roles: RoleType[] = user?.roles.map((r) => r.name as RoleType) ?? [];

  const highestRole = getHighestRole(roles);

  return (
    <SidebarProvider className="block">
      <div className="flex h-screen overflow-hidden">
        {checkUser(user, isLoading) ? <AppSidebar /> : ""}
        <SidebarInset className="flex-1 flex flex-col overflow-hidden w-full">
          <header className="sticky top-0 z-40 flex bg-primary justify-between items-center px-4 h-14">
            <div className="flex items-center gap-2 h-14 shrink-0 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
              <SidebarTrigger className="-ml-1 shadow-none" />
            </div>
            <HeaderLayout />
          </header>
          <main className="flex-1 overflow-auto p-4 bg-secondary w-full animate-fade-in-up" key={location.pathname}>
            <RenderIf value={checkUser(user, isLoading)}>
              <div className="rounded-sm bg-background py-2 px-5 mb-4 shadow-lg">
                <DynamicBreadcrumb role={highestRole} />
              </div>
            </RenderIf>
            {children}
          </main>
          {/* <FooterLayout /> */}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DefaultLayout;
