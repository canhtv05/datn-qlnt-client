import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Download, LucideIcon, Plus, Trash2, Upload } from "lucide-react";
import { TooltipTrigger } from "@radix-ui/react-tooltip";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface BtnType {
  tooltipContent: string;
  icon: LucideIcon;
  arrowColor: string;
  type: "default" | "upload" | "delete" | "download";
  hasConfirm: boolean;
}

const btns: BtnType[] = [
  {
    tooltipContent: "Thêm mới",
    icon: Plus,
    arrowColor: "var(--color-primary)",
    type: "default",
    hasConfirm: true,
  },
  {
    tooltipContent: "Tải lên Excel",
    icon: Upload,
    arrowColor: "var(--color-amber-500)",
    type: "upload",
    hasConfirm: false,
  },
  {
    tooltipContent: "Tải xuống Excel",
    icon: Download,
    arrowColor: "var(--color-emerald-500)",
    type: "download",
    hasConfirm: false,
  },
  {
    tooltipContent: "Xóa",
    icon: Trash2,
    arrowColor: "var(--color-red-400)",
    type: "delete",
    hasConfirm: true,
  },
];

const BuildingButton = () => {
  return (
    <div className="h-full bg-background rounded-t-sm mt-4">
      <div className="flex px-4 py-3 justify-between items-center">
        <h3 className="font-semibold">Tòa nhà</h3>
        <div className="flex gap-2">
          {btns.map((btn, index) => (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size={"icon"} variant={btn.type} className="cursor-pointer">
                    <btn.icon className="text-white" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent
                  className="text-white"
                  style={{
                    background: btn.arrowColor,
                  }}
                  arrow={false}
                >
                  <p>{btn.tooltipContent}</p>
                  <TooltipPrimitive.Arrow
                    style={{
                      fill: btn.arrowColor,
                      background: btn.arrowColor,
                    }}
                    className={"size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]"}
                  />
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuildingButton;
