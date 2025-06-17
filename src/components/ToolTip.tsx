import { ReactNode } from "react";

import { Tooltip as ToolTipHover, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const Tooltip = ({ content, children }: { content: string; children: ReactNode }) => {
  return (
    <TooltipProvider>
      <ToolTipHover>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>{content}</TooltipContent>
      </ToolTipHover>
    </TooltipProvider>
  );
};

export default Tooltip;
