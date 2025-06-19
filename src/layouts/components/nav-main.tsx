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
        tooltip={title}
        className={cn(
          isActive && "shadow-none bg-muted",
          "text-black hover:[&_.icon]:stroke-white hover:[&_.icon]:text-white dark:text-white"
        )}
      >
        {ItemIcon && <ItemIcon className={cn(isActive && "stroke-black dark:stroke-white icon")} />}
        <span className={cn(isActive && "text-black dark:text-white icon")}>{title}</span>
        {items && (
          <ChevronRight
            className={cn(
              "ml-auto group-data-[state=open]/collapsible:rotate-90 icon",
              isActive && "text-black dark:text-white"
            )}
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
