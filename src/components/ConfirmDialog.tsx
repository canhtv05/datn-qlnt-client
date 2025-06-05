import { forwardRef, ReactNode, useImperativeHandle, useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

export type AlertDialogRef = {
  open: () => void;
};

const ConfirmDialog = forwardRef<
  AlertDialogRef,
  {
    typeTitle: "thêm" | "chỉnh sửa" | "xóa";
    onContinue: () => void;
    children?: ReactNode;
  }
>(({ typeTitle, onContinue, children }, ref) => {
  const [open, setOpen] = useState<boolean>(false);

  // expose open function
  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
  }));

  const handleContinue = () => {
    onContinue?.();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn {typeTitle} không?</AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]">
            Không thể hoàn tác hành động này. Thao tác này sẽ {typeTitle} của bạn{" "}
            {typeTitle === "xóa" ? "khỏi " : "vào "}máy chủ của chúng tôi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleContinue}
            className={cn(buttonVariants({ variant: "default" }), "text-white")}
          >
            Tiếp tục
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});

ConfirmDialog.displayName = "ConfirmDialog";

export default ConfirmDialog;
