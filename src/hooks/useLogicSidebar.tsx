import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { menusSidebar } from "@/constant";
import type { MenuSidebarChildType } from "@/types";

const useLogicSidebar = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const [menus, setMenus] = useState<MenuSidebarChildType[]>([]);
  useEffect(() => {
    const res = menusSidebar.find((menu) => {
      return pathname.startsWith(`/${menu.type}`);
    });
    setMenus(res?.children ?? []);
  }, [pathname]);

  return menus;
};

export default useLogicSidebar;
