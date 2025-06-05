import { useNavigate } from "react-router-dom";
import { memo, ReactElement, ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { X } from "lucide-react";

interface DialogLinkProps {
  children: ReactNode;
  title: string;
  outline?: boolean;
  component?: ReactElement;
}

function DialogLink({ children, title, outline = false, component }: DialogLinkProps) {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent
        className={`bg-card text-card-foreground w-[80vw]
          ${outline ? "border-2 border-border" : "border-none"}
          rounded-lg font-geist md:w-[70%] w-full
        `}
        showCloseButton={false}
      >
        <DialogHeader className="border-foreground/20 border-b-1 px-4 py-2 bg-secondary rounded-t-md">
          <DialogTitle className="text-lg font-semibold text-foreground flex justify-between items-center">
            <span className="text-left text-[16px] dark:text-white text-black">{title}</span>
            <div className="flex gap-2">
              {component}
              <DialogClose className="cursor-pointer">
                <X className="size-4" />
              </DialogClose>
            </div>
          </DialogTitle>
          <DialogDescription className="sr-only">Dialog for viewing article details</DialogDescription>
        </DialogHeader>
        <div className="px-4 overflow-auto max-h-[80vh]">{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default memo(DialogLink);
