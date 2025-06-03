import Logo from "@/components/Logo";
import RenderIf from "@/components/RenderIf";
import { SidebarMenu, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

export function TeamSwitcher() {
  const { open } = useSidebar();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <RenderIf value={open}>
          <Logo />
        </RenderIf>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
