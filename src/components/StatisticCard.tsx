import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Card, CardContent } from "./ui/card";
import { cn } from "@/lib/utils";
import { useSidebar } from "./ui/sidebar";
import useViewport from "@/hooks/useViewport";
import { Viewport } from "@/enums";
import RenderIf from "./RenderIf";

interface StatisticCardType {
  value: number;
  label: string;
  icon: LucideIcon;
}

const handleClassGrid = (length: number) => {
  switch (length) {
    case 1:
      return "grid-cols-1";
    case 2:
      return "sm:grid-cols-2 grid-cols-1";
    case 3:
      return "md:grid-cols-3 grid-cols-1";
    case 4:
      return "lg:grid-cols-4 md:grid-cols-2 grid-cols-1";
    case 5:
      return "xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 grid-cols-1";
    default:
      return "grid-cols-5";
  }
};

const WIDTH_SIDEBAR = 255.22;
const StatisticCard = ({ data }: { data: StatisticCardType[] }) => {
  const length = useMemo(() => data.length, [data.length]);
  const gridCols = handleClassGrid(length);
  const { open: sidebarOpen } = useSidebar();
  const { width } = useViewport();
  const [open, setOpen] = useState<boolean>(true);

  useEffect(() => {
    if ((width > Viewport.MD && width - WIDTH_SIDEBAR > Viewport.SM && !open) || !sidebarOpen) {
      setOpen(true);
    }
  }, [open, width, sidebarOpen]);

  return (
    <div
      className={`flex flex-col items-end ${
        (width - WIDTH_SIDEBAR <= Viewport.SM && !sidebarOpen) ||
        (width - WIDTH_SIDEBAR <= Viewport.SM && !sidebarOpen && width > Viewport.MD)
          ? "pt-5"
          : ""
      }`}
    >
      <RenderIf value={width <= Viewport.MD || (width - WIDTH_SIDEBAR <= Viewport.SM && sidebarOpen)}>
        <div className="cursor-pointer p-0.5 my-2 bg-background rounded-full" onClick={() => setOpen((prev) => !prev)}>
          <ChevronDown className={open ? "" : "rotate-180"} />
        </div>
      </RenderIf>

      {width <= Viewport.MD || width - WIDTH_SIDEBAR <= Viewport.SM ? (
        <AnimatePresence>
          {open && (
            <motion.div
              key="card-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "grid w-full",
                gridCols,
                length > 1 && "gap-5",
                sidebarOpen && width - WIDTH_SIDEBAR <= Viewport.SM && "!grid-cols-1"
              )}
            >
              {data.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="shadow-none border-none rounded-sm py-3">
                    <CardContent className="flex justify-between items-center px-4">
                      <div className="flex-col flex">
                        <span className="font-black text-[20px] text-foreground">{item.value}</span>
                        <span
                          className={cn(
                            "text-foreground font-medium text-[14px] truncate",
                            sidebarOpen && "xl:max-w-[150px] md:max-w-[100px] max-w-[75px]",
                            width <= Viewport.MD && "max-w-full",
                            sidebarOpen && width <= Viewport.LG && "!max-w-full"
                          )}
                        >
                          {item.label}
                        </span>
                      </div>
                      <div className="p-2 bg-secondary rounded-full">
                        <item.icon className="size-5 text-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <div
          className={cn(
            "grid w-full",
            gridCols,
            length > 1 && "gap-5",
            sidebarOpen && width - WIDTH_SIDEBAR <= Viewport.SM && "!grid-cols-1"
          )}
        >
          {data.map((item, index) => (
            <Card className="shadow-none border-none rounded-sm py-3" key={index}>
              <CardContent className="flex justify-between items-center px-4">
                <div className="flex-col flex flex-1">
                  <span className="font-black text-[20px] text-foreground">{item.value}</span>
                  <span className={cn("text-foreground font-medium text-[14px] truncate max-w-[80%]")}>
                    {item.label}
                  </span>
                </div>
                <div className="p-2 bg-secondary rounded-full">
                  <item.icon className="size-5 text-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StatisticCard;
