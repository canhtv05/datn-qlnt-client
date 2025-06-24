import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { OctagonAlert } from "lucide-react";

interface UseConfirmDialogProps<T = void> {
  onConfirm: (arg?: T) => Promise<boolean>;
  desc?: string;
  type?: "warn" | "default";
}

export const useConfirmDialog = <T = void,>({ onConfirm, desc, type = "warn" }: UseConfirmDialogProps<T>) => {
  const [open, setOpen] = useState(false);
  const [confirmArg, setConfirmArg] = useState<T | undefined>(undefined);

  const openDialog = (arg?: T) => {
    setConfirmArg(arg);
    setOpen(true);
  };

  const ConfirmDialog = () => (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader className="items-center">
          <AlertDialogTitle>
            <div
              className={`mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                type === "warn" ? "bg-orange-500/10" : "bg-primary/10"
              }`}
            >
              <OctagonAlert className={`h-7 w-7 ${type === "warn" ? "text-orange-500" : "text-primary"}`} />
            </div>
            Bạn có chắc chắn muốn tiếp tục không?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px] text-center">
            {!desc
              ? "Điều này sẽ làm thay đổi dữ liệu của bạn tại máy chủ của chúng tôi. Bạn có chắc chắn muốn tiếp tục?"
              : desc}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-2 sm:justify-center">
          <AlertDialogCancel className={buttonVariants({ variant: "outline" })} onClick={() => setOpen(false)}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: type === "warn" ? "upload" : "default" })}
            onClick={async () => {
              const ok = await onConfirm(confirmArg);
              if (ok) {
                setOpen(false);
              }
            }}
          >
            Xác nhận
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    ConfirmDialog,
    openDialog,
  };
};
