import { ReactIcon } from "@/assets/icons";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

export function NavHeader() {
  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
            <div className="flex aspect-square items-center justify-center rounded-lg  text-sidebar-primary-foreground">
              <ReactIcon className="size-6" />
            </div>
            <div className="grid flex-1 text-left !text-[11px] leading-tight">
              <span className="truncate font-semibold">UDPM - QL Bài viết</span>
              <span className="truncate font-regular">Nhóm 2 - canhtv05</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  );
}
