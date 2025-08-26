import { RefreshCw, Search } from "lucide-react";
import Tooltip from "./ToolTip";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip as TT } from "./ui/tooltip";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

interface ButtonFilter {
  onClear: () => void;
}

const ButtonFilter = ({ onClear }: ButtonFilter) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <TT>
          <TooltipTrigger asChild>
            <Button
              size={"icon"}
              variant={"ghost"}
              type="button"
              className="bg-secondary cursor-pointer"
              onClick={onClear}
            >
              <RefreshCw />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-white" style={{ background: "var(--color-gray-400)" }} arrow={false}>
            <p>{t("common.button.reload")}</p>
            <TooltipPrimitive.Arrow
              style={{
                fill: "var(--color-gray-400)",
                background: "var(--color-gray-400)",
              }}
              className="size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"
            />
          </TooltipContent>
        </TT>
      </TooltipProvider>
      <Tooltip content={t("common.button.search")}>
        <Button size={"icon"} type="submit" className="cursor-pointer text-white">
          <Search />
        </Button>
      </Tooltip>
    </div>
  );
};

export default ButtonFilter;
