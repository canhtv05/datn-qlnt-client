import { CircleUserRound, LogOut, Moon, Settings, Sun } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import useTheme from "@/hooks/useTheme";
import RenderIf from "@/components/RenderIf";
import { useAuthStore } from "@/zustand/authStore";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "@/components/Image";
import { useLogout } from "./useLogout";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import useHighestRole from "@/hooks/useHighestRole";
import Notification from "@/components/Notification";

const HeaderLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const user = useAuthStore((state) => state.user);

  const { handleLogout } = useLogout();
  const { ConfirmDialog, openDialog } = useConfirmDialog({
    onConfirm: handleLogout,
    type: "default",
    desc: "Bạn sẽ được đăng xuất khỏi hệ thống. Hành động này sẽ kết thúc phiên làm việc hiện tại của bạn.",
  });

  const highestRole = useHighestRole();

  return (
    <header className="flex items-center">
      <Button onClick={toggleTheme} className="shadow-none cursor-pointer">
        <RenderIf value={theme === "dark"}>
          <Moon className="size-5 stroke-white" />
        </RenderIf>
        <RenderIf value={theme === "light"}>
          <Sun className="size-5 stroke-white" />
        </RenderIf>
      </Button>
      <Notification />
      <div className="flex gap-2 items-center">
        <div className="flex flex-col md:max-w-[200px] sm:max-w-[200px] max-w-[100px]">
          <h2 className="font-semibold text-[14px] truncate text-white">
            {!user?.fullName ? <span className="inline-block opacity-0">N/A</span> : user?.fullName}
          </h2>
          <h2 className="font-normal truncate text-right text-white/80 text-[14px]">
            {(() => {
              return highestRole ?? "N/A";
            })()}
          </h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer">
              <Image src={user?.profilePicture} alt={user?.fullName} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={"bottom"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Image src={user?.profilePicture} alt={user?.fullName} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.fullName}</span>
                  <span className="truncate text-xs">{user?.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile", { state: { background: location } })}>
              <CircleUserRound className="text-light" />
              Hồ sơ cá nhân
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="text-light" />
              Cài đặt
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => openDialog()}>
              <LogOut className="text-light" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ConfirmDialog />
      </div>
    </header>
  );
};

export default HeaderLayout;
