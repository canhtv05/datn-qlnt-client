import { ReactNode, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const DialogCustom = ({
  trigger,
  title,
  children,
  onContinue,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  className,
}: {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  onContinue: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  desc?: string;
  className?: string;
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;

  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange! : setInternalOpen;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className={cn("max-h-[90%] h-auto p-0 flex flex-col md:max-w-[90%]", className)}>
          <DialogHeader className="sticky top-0 left-0 w-full z-50">
            <DialogTitle className="px-5 py-2.5 bg-secondary rounded-t-sm flex justify-between items-center">
              <p>{title}</p>
              <DialogClose asChild>
                <Button
                  type="button"
                  onClick={() => onOpenChange && onOpenChange(false)}
                  size="icon"
                  className="rounded-full shadow-none hover:bg-transparent size-[30px] bg-transparent"
                >
                  <X className="stroke-foreground" />
                </Button>
              </DialogClose>
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="hidden" />
          <div className="flex-1 overflow-y-auto px-5 pt-4">{children}</div>
          <DialogFooter className="border-t rounded-b-md bg-background px-5 py-3">
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button type="button" onClick={onContinue} className="text-white">
              Tiếp tục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogCustom;
