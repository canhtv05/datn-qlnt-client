import { Link, useLocation } from "react-router-dom";

import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { MenuSidebarChildType } from "@/types";
import RenderIf from "@/components/RenderIf";

export function NavMain({ items }: { items: MenuSidebarChildType[] }) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = location.pathname.includes(item.to);

          return (
            <Collapsible key={item.label} asChild className="group/collapsible">
              <SidebarMenuItem className={`${isActive ? "bg-customize/30 relative" : ""} rounded-lg`}>
                <RenderIf value={isActive}>
                  <span className="absolute bg-customize-hover/30 w-[10px] h-full rounded-l-lg left-[0.3px] bg-[]"></span>
                </RenderIf>
                <CollapsibleTrigger asChild>
                  <Link to={item.to}>
                    <SidebarMenuButton tooltip={item.label}>
                      {item.icon && <item.icon className="text-foreground !size-5" />}
                      <span className="text-foreground text-left text-[14px] font-medium">{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </CollapsibleTrigger>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
