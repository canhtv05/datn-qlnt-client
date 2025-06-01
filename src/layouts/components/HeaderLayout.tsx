import { BellIcon, Moon, Sun } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useTheme from "@/hooks/useTheme";
import RenderIf from "@/components/RenderIf";

const HeaderLayout = () => {
  const { theme, toggleTheme } = useTheme();

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
        <div className="flex flex-col max-w-[92px]">
          <h2 className="font-semibold text-[14px] truncate text-white">Trần Văn Cảnh</h2>
          <h2 className="font-normal truncate text-right text-white/80 text-[14px]">Chủ nhà</h2>
        </div>
        <Avatar className="size-[40px]">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};

export default HeaderLayout;
