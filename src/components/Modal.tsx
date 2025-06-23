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
}: {
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  onConfirm: () => Promise<boolean>;
}) => {
  const [openMain, setOpenMain] = useState(false);

  const handleConfirm = useCallback(async (): Promise<boolean> => {
    try {
      const result = await onConfirm();
      if (result) {
        setOpenMain(false);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, [onConfirm]);

  const { ConfirmDialog, openDialog } = useConfirmDialog({ onConfirm: handleConfirm });

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      openDialog();
    },
    [openDialog]
  );

  return (
    <>
      <Dialog open={openMain} onOpenChange={setOpenMain}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="md:max-w-3xl max-h-[90vh] p-0 [&>button.absolute]:hidden overflow-hidden flex flex-col">
          <DialogHeader className="sticky top-0 left-0 w-full z-50">
            <DialogTitle className="px-5 py-2.5 bg-secondary rounded-t-sm flex justify-between items-center">
              <p>{title}</p>
              <Button
                type="button"
                onClick={() => setOpenMain(false)}
                size="icon"
                className="rounded-full shadow-none hover:bg-transparent size-[30px] bg-transparent"
              >
                <X className="stroke-foreground" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="hidden" />

          <form onSubmit={handleSubmit} id="modal-form" className="flex-1 overflow-y-auto px-5 pt-4">
            {children}
          </form>

          <DialogFooter className="border-t bg-background px-5 py-3">
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
