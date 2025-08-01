import { Link, useLocation } from "react-router-dom";
import { ChevronsRight, Home } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import { sidebarItems } from "@/constant";

export function DynamicBreadcrumb({ role }: { role: "USER" | "MANAGER" | "ADMIN" | "STAFF" }) {
  const location = useLocation();
  const pathname = location.pathname;
  const paths = pathname.split("/").filter(Boolean);

  const menu = sidebarItems(role);

  const findLabel = (segments: string[]): { title: string; url: string }[] => {
    const result: { title: string; url: string }[] = [];
    let currentItems = menu;
    let currentPath = "";

    for (const segment of segments) {
      currentPath += `/${segment}`;
      const found = currentItems.find((item) => item.url === currentPath);
      if (found) {
        result.push({ title: found.title, url: found.url });
        if (found.items) currentItems = found.items;
      } else {
        // fallback nếu không tìm được (có thể là dynamic param hoặc slug)
        result.push({ title: decodeURIComponent(segment), url: currentPath });
      }
    }

    return result;
  };

  const crumbs = findLabel(paths);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          const isParentOnly = menu.some((item) => item.url === crumb.url && item.items?.length); // mục có children

          return (
            <Fragment key={crumb.url}>
              <BreadcrumbSeparator>
                <ChevronsRight className="w-4 h-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast || isParentOnly ? (
                  <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={crumb.url}>{crumb.title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
