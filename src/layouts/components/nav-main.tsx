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
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { sidebarItems, SideBarType } from "@/constant";
import RenderIf from "@/components/RenderIf";
import useHighestRole from "@/hooks/useHighestRole";

const NavBarParent = ({ props, isActive }: { props: SideBarType; isActive: boolean }) => {
  const { title, icon: ItemIcon, items, url } = props;
  const { setOpen } = useSidebar();

  const commonClasses = cn(
    isActive && "shadow-none bg-muted",
    "text-black hover:[&_.icon]:stroke-white hover:[&_.icon]:text-white dark:text-white"
  );

  if (!items) {
    return (
      <Link to={url} className="w-full">
        <SidebarMenuButton tooltip={title} isActive={isActive} className={cn(commonClasses, "h-10")}>
          {ItemIcon && <ItemIcon className={cn("icon", isActive && "stroke-white")} />}
          <span className={cn("icon", isActive && "text-white")}>{title}</span>
        </SidebarMenuButton>
      </Link>
    );
  }

  return (
    <CollapsibleTrigger asChild>
      <SidebarMenuButton tooltip={title} className={commonClasses} onClick={() => setOpen(true)}>
        {ItemIcon && <ItemIcon className={cn("icon", isActive && "stroke-black dark:stroke-white")} />}
        <span className={cn("icon", isActive && "text-black dark:text-white")}>{title}</span>
        <ChevronRight
          className={cn(
            "ml-auto group-data-[state=open]/collapsible:rotate-90 icon",
            isActive && "text-black dark:text-white"
          )}
          style={{ transition: "none" }}
        />
      </SidebarMenuButton>
    </CollapsibleTrigger>
  );
};

export function NavMain() {
  const location = useLocation();
  const highestRole = useHighestRole();

  const sidebar = highestRole ? sidebarItems(highestRole) : [];

  return (
    <SidebarGroup>
      <SidebarMenu>
        {sidebar.map((item, index) => {
          const isActive = location.pathname.startsWith(item.url);

          return (
            <Fragment key={index}>
              <RenderIf value={!!item.label}>
                <SidebarGroupLabel className="group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:pointer-events-none">
                  {item.label}
                </SidebarGroupLabel>
              </RenderIf>

              {item.items ? (
                <Collapsible key={item.title} asChild defaultOpen={isActive} className="group/collapsible">
                  <SidebarMenuItem>
                    <NavBarParent props={item} isActive={isActive} />
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => {
                          return (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                className={cn(
                                  "hover:[&_.icon]:!text-white",
                                  location.pathname.split("/")[2] === subItem.url.split("/")[2] &&
                                    "bg-primary [&_.icon]:!text-white shadow-primary"
                                )}
                              >
                                <Link to={subItem.url} className="group flex items-center gap-2">
                                  <subItem.icon className="icon !size-3 dark:!text-white !text-black transition-colors duration-200" />
                                  <span className="w-full h-full flex items-center dark:!text-white !text-black icon">
                                    {subItem.title}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        })}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.title}>
                  <NavBarParent props={item} isActive={isActive} />
                </SidebarMenuItem>
              )}
            </Fragment>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
