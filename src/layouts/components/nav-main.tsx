import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { sidebarItems, SideBarType } from "@/constant";
import RenderIf from "@/components/RenderIf";

const NavBarParent = ({ props, isActive }: { props: SideBarType; isActive: boolean }) => {
  const { title, icon: ItemIcon, items } = props;
  return (
    <CollapsibleTrigger asChild>
      <SidebarMenuButton
        isActive={isActive}
        tooltip={title}
        className={cn(isActive && "shadow-primary", "text-black dark:text-white")}
      >
        {ItemIcon && <ItemIcon className={cn(isActive && "stroke-white")} />}
        <span className={cn(isActive && "text-white")}>{title}</span>
        {items && (
          <ChevronRight
            className={cn("ml-auto group-data-[state=open]/collapsible:rotate-90 ", isActive && "text-white")}
            style={{ transition: "none" }}
          />
        )}
      </SidebarMenuButton>
    </CollapsibleTrigger>
  );
};

export function NavMain() {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {sidebarItems.map((item, index) => {
          const isActive = location.pathname.startsWith(item.url);

          return (
            <Fragment key={index}>
              <RenderIf value={!!item.label}>
                <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
              </RenderIf>
              {item.items ? (
                <Collapsible key={item.title} asChild defaultOpen={isActive} className="group/collapsible">
                  <SidebarMenuItem>
                    <NavBarParent props={item} isActive={isActive} />
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title} className="hover:[&_.icon]:!text-white">
                            <SidebarMenuSubButton asChild>
                              <Link to={subItem.url} className="group flex items-center gap-2">
                                <subItem.icon className="icon !size-3 dark:!text-white !text-black icon transition-colors duration-200" />
                                <span className="w-full h-full flex items-center dark:!text-white !text-black icon">
                                  {subItem.title}
                                </span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className={cn(isActive && "shadow-primary", "text-black dark:text-white")}
                  >
                    <Link to={item.url} className="flex items-center gap-2 pointer-events-auto py-5">
                      {item.icon && <item.icon className={cn(isActive && "stroke-white")} />}
                      <span className={cn(isActive && "text-white")}>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </Fragment>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
