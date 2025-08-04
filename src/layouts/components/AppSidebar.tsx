import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import FooterLayout from "./FooterLayout";
import { Button } from "@/components/ui/button";
import { MailPlus } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarRail />
      {/* <SidebarFooter>
        <Button
          variant="outline"
          size="sm"
          className="relative z-10 group hover:text-white hover:shadow-[0_8px_25px_-8px_#ff9f43] hover:bg-[#ff9f43] border-[#ff9f43] dark:border-[#ff9f43] dark:hover:bg-[#ff9f43] flex items-center gap-2"
        >
          <MailPlus className="stroke-[#ff9f43] group-hover:stroke-white" />
          <span className="text-[12px] text-[#ff9f43] group-hover:text-white">Nhắn tin hỗ trợ</span>
        </Button>
      </SidebarFooter> */}
    </Sidebar>
  );
}
