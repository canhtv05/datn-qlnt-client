import { Link, useLocation } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/layouts/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import RenderIf from "@/components/RenderIf";
import { MoonStar, Sun } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import type { ReactNode } from "react";
import useLogicSidebar from "@/hooks/useLogicSidebar";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const menus = useLogicSidebar();

  const menu = menus.find((menu) => location.pathname.includes(menu.to));

  const { theme, toggleTheme } = useTheme();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 lef-0 bg-background z-50">
          <div className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <RenderIf value={theme === "dark"}>
                <Button
                  className="bg-background text-foreground hover:bg-accent/50 duration-200 transition-colors"
                  size={"icon"}
                  onClick={toggleTheme}
                >
                  <Sun className="size-5" />
                </Button>
              </RenderIf>
              <RenderIf value={theme === "light"}>
                <Button
                  className="bg-background text-foreground hover:bg-accent/50 duration-200 transition-colors"
                  size={"icon"}
                  onClick={toggleTheme}
                >
                  <MoonStar className="size-5" />
                </Button>
              </RenderIf>
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <RenderIf value={!!menu?.label}>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </RenderIf>
                  <BreadcrumbItem>
                    <BreadcrumbPage>
                      <Link to={`${menu?.to}`}>{menu?.label}</Link>
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
          <Separator />
        </header>
        <div className="mt-2 w-full h-full px-4 py-[0.5px] pb-2">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DefaultLayout;
