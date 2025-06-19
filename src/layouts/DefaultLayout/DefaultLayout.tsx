import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import { AppSidebar } from "../components/AppSidebar";
import HeaderLayout from "../components/HeaderLayout";
import FooterLayout from "../components/FooterLayout";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="relative">
        <header className="sticky left-0 top-0 z-40 flex bg-primary justify-between items-center px-4 h-14 w-full">
          <div className="flex items-center gap-2 h-14 shrink-0 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
            <SidebarTrigger className="-ml-1 shadow-none" />
          </div>
          <HeaderLayout />
        </header>
        <div className="p-4 w-full h-full bg-secondary">{children}</div>
        <FooterLayout />
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DefaultLayout;
