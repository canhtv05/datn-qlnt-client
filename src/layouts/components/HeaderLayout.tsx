import { CircleUserRound, Key, LogOut, Moon, Sun } from "lucide-react";
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
import { useAuth } from "./useAuth";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import useHighestRole from "@/hooks/useHighestRole";
import SystemNotification from "@/components/system/SystemNotification";
import useLocalStorage from "@/hooks/useLocalStorage";
import images from "@/assets/imgs";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { switchRole } from "@/lib/utils";
import Modal from "@/components/Modal";
import ChangePassword from "./ChangePassword";

const HeaderLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const user = useAuthStore((state) => state.user);
  const { t } = useTranslation();
  const { setStorage } = useLocalStorage();

  const {
    handleLogout,
    errors,
    handleChangePassword,
    isModalOpen,
    setIsModalOpen,
    setValue,
    value,
  } = useAuth();
  const { ConfirmDialog, openDialog } = useConfirmDialog({
    onConfirm: handleLogout,
    type: "default",
    desc: t("profile.confirmLogout"),
  });

  const highestRole = useHighestRole();
  const currentLang = i18next.language as "vi" | "en";

  const handleToggleLang = () => {
    const newLang = currentLang === "vi" ? "en" : "vi";
    setStorage({ language: newLang });
    i18next.changeLanguage(newLang);
    window.location.reload();
  };

  return (
    <header className="flex items-center">
      <div className="p-2 cursor-pointer" onClick={handleToggleLang}>
        <img
          src={i18next.language === "en" ? images.uk : images.vietnam}
          alt="lang-flag"
          className="size-5 block"
        />
      </div>
      <Button onClick={toggleTheme} className="shadow-none cursor-pointer">
        <RenderIf value={theme === "dark"}>
          <Moon className="size-5 stroke-white" />
        </RenderIf>
        <RenderIf value={theme === "light"}>
          <Sun className="size-5 stroke-white" />
        </RenderIf>
      </Button>
      <SystemNotification />
      <div className="flex gap-2 items-center">
        <div className="flex flex-col md:max-w-[200px] sm:max-w-[200px] max-w-[100px]">
          <h2 className="font-semibold text-[14px] truncate text-white">
            {!user?.fullName ? <span className="inline-block opacity-0">N/A</span> : user?.fullName}
          </h2>
          <h2 className="font-normal truncate text-right text-white/80 text-[14px]">
            {(() => {
              return switchRole(highestRole, t);
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
            <DropdownMenuItem
              onClick={() => navigate("/profile", { state: { background: location } })}
            >
              <CircleUserRound className="text-light" />
              {t("profile.personalProfile")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setIsModalOpen(true)}>
              <Key className="text-light" />
              {t("headerLayout.changePassword")}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => openDialog()}>
              <LogOut className="text-light" />
              {t("profile.logout")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Modal
          title={t("headerLayout.changePassword")}
          trigger={null}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onConfirm={handleChangePassword}
          desc={t("headerLayout.confirmChangePassword")}
        >
          <ChangePassword value={value} setValue={setValue} errors={errors} />
        </Modal>
        <ConfirmDialog />
      </div>
    </header>
  );
};

export default HeaderLayout;
