  import { BellIcon, CircleUserRound, LogOut, Moon, Settings, Sun } from "lucide-react";
  import { useRef } from "react";
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
import ConfirmDialog, { AlertDialogRef } from "@/components/ConfirmDialog";
import { useLogout } from "./useLogout";

  const HeaderLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const user = useAuthStore((state) => state.user);
      const dialogRef = useRef<AlertDialogRef>(null);

    const {handleLogout } = useLogout();

    const handleShowConfirmLogout = () => {
      dialogRef.current?.open();
    }

    return (
      <header className="flex items-center">
        <Button onClick={toggleTheme} className="shadow-none">
          <RenderIf value={theme === "dark"}>
            <Moon className="size-5 stroke-white" />
          </RenderIf>
          <RenderIf value={theme === "light"}>
            <Sun className="size-5 stroke-white" />
          </RenderIf>
        </Button>
        <div className="flex items-center gap-2 mr-4">
          <div className="relative">
            <Button size="icon" className="shadow-none">
              <BellIcon className="size-5 stroke-white" />
            </Button>
            <span className="absolute top-2 right-0 px-1 min-w-4 translate-x-1/2 -translate-y-1/2 origin-center flex items-center justify-center rounded-full text-xs bg-destructive text-white">
              2
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex flex-col md:max-w-[200px] sm:max-w-[200px] max-w-[100px]">
            <h2 className="font-semibold text-[14px] truncate text-white">
              {!user?.fullName ? <span className="inline-block opacity-0">Chủ nhà</span> : user?.fullName}
            </h2>
            <h2 className="font-normal truncate text-right text-white/80 text-[14px]">Chủ nhà</h2>
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
             <DropdownMenuItem onClick={handleShowConfirmLogout}>
               <LogOut className="text-light" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ConfirmDialog ref={dialogRef} typeTitle="đăng xuất" onContinue={handleLogout}/>
        </div>
      </header>
    );
  };

  export default HeaderLayout;
