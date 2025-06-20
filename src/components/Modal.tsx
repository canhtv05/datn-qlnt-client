import { FormEvent, ReactNode, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "./ui/button";
import { OctagonAlert, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

const Modal = ({
  trigger,
  title,
  onContinue,
  children,
}: {
  trigger: ReactNode;
  onContinue?: () => void;
  title: string;
  children: ReactNode;
}) => {
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openMain, setOpenMain] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setOpenConfirm(true);
  };

  const handleConfirm = () => {
    onContinue?.();
    setOpenConfirm(false);
    setOpenMain(false);
  };

  return (
    <div>
      <Dialog open={openMain} onOpenChange={setOpenMain}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="md:max-w-3xl [&>button.absolute]:hidden !w-[1500px]">
          <DialogHeader>
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
            <DialogDescription />
            <form onSubmit={handleSubmit} className="">
              <div className="px-5">{children}</div>
              <div className="flex mt-10 gap-3 justify-end px-5 py-3 items-center border-t">
                <DialogClose asChild>
                  <Button variant="outline">Hủy</Button>
                </DialogClose>
                <Button type="submit">Tiếp tục</Button>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <AlertDialog open={openConfirm} onOpenChange={setOpenConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader className="items-center">
            <AlertDialogTitle>
              <div className="mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/10">
                <OctagonAlert className="h-7 w-7 text-orange-500" />
              </div>
              Bạn có chắc chắn muốn tiếp tục?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[15px] text-center">
              Hành động này không thể được hoàn tác. Điều này sẽ làm thay đổi dữ liệu của bạn tại máy chủ của chúng tôi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2 sm:justify-center">
            <AlertDialogCancel className={buttonVariants({ variant: "outline" })} onClick={() => setOpenConfirm(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction className={buttonVariants({ variant: "upload" })} onClick={handleConfirm}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Modal;
