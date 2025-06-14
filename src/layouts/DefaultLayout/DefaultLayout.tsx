import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { ReactNode } from "react";
import { AppSidebar } from "../components/app-sidebar";
import HeaderLayout from "../components/HeaderLayout";
import useViewport from "@/hooks/useViewport";
import { Viewport } from "@/enums";
// import FooterLayout from "../components/FooterLayout";

const WIDTH_SIDEBAR = 255.22;
const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const { width } = useViewport();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex bg-primary justify-between items-center px-4">
          <div className="flex items-center gap-2 h-14 shrink-0 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
            <SidebarTrigger className="-ml-1 shadow-none" />
          </div>
          <HeaderLayout />
        </header>
        <div
          className={`${
            width <= Viewport.MD || width - WIDTH_SIDEBAR <= Viewport.SM ? "pb-5 px-5" : "p-5"
          } w-full h-full bg-secondary`}
        >
          {children}
        </div>
        {/* <FooterLayout /> */}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DefaultLayout;
