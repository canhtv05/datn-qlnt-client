import { FormEvent, ReactNode, useCallback, useState } from "react";
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
import { useConfirmDialog } from "@/hooks";

const Modal = ({
  trigger,
  title,
  children,
  onConfirm,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  desc,
}: {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  onConfirm: () => Promise<boolean>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  desc?: string;
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;

  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const handleConfirm = useCallback(async () => {
    const result = await onConfirm();
    if (result) {
      onOpenChange(false);
    }
    return result;
  }, [onConfirm, onOpenChange]);

  const { ConfirmDialog, openDialog } = useConfirmDialog({ onConfirm: handleConfirm, desc });

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      openDialog(undefined);
    },
    [openDialog]
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent className="max-h-[90%] h-auto p-0 flex flex-col md:max-w-[90%]">
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

          <form
            id="modal-form"
            name="modal-form"
            className="flex-1 overflow-y-auto px-5 pt-4"
            onSubmit={handleSubmit}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </form>

          <DialogFooter className="border-t rounded-b-md bg-background px-5 py-3">
            <DialogClose asChild>
              <Button variant="outline">Hủy</Button>
            </DialogClose>
            <Button type="submit" form="modal-form">
              Tiếp tục
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ConfirmDialog />
    </>
  );
};

export default Modal;
