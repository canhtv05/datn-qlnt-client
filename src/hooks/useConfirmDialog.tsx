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
import { cn } from "@/lib/utils";

type TypeTitle = "thêm" | "chỉnh sửa" | "xóa" | "đăng xuất";

interface UseConfirmDialogProps {
  typeTitle: TypeTitle;
  onConfirm: () => void;
}

export const useConfirmDialog = ({ typeTitle, onConfirm }: UseConfirmDialogProps) => {
  const [open, setOpen] = useState(false);

  const openDialog = () => setOpen(true);

  const ConfirmDialog = () => (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn {typeTitle} không?</AlertDialogTitle>
          <AlertDialogDescription className="text-[15px]">
            Không thể hoàn tác hành động này. Thao tác này sẽ {typeTitle} của bạn{" "}
            {typeTitle === "xóa" ? "khỏi " : "vào "}máy chủ của chúng tôi.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer" onClick={() => setOpen(false)}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
            className={cn(buttonVariants({ variant: "default" }), "text-white cursor-pointer")}
          >
            Tiếp tục
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
