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

export type ConfirmDialogType = "delete" | "status" | "update";

export interface ConfirmDialogPayload {
  id: string;
  type: ConfirmDialogType;
}

interface UseConfirmDialogProps<T = void> {
  onConfirm: (arg: T) => Promise<boolean>;
  desc?: string | ((arg: T) => string);
  type?: "warn" | "default";
}

export const useConfirmDialog = <T = void,>({ onConfirm, desc, type = "warn" }: UseConfirmDialogProps<T>) => {
  const [open, setOpen] = useState(false);
  const [payload, setPayload] = useState<T | undefined>(undefined);
  const [overrideDesc, setOverrideDesc] = useState<string | ((arg: T) => string)>();
  const [overrideType, setOverrideType] = useState<"warn" | "default">();

  const openDialog = (
    payload: T,
    options?: {
      desc?: string | ((arg: T) => string);
      type?: "warn" | "default";
    }
  ) => {
    setPayload(payload);
    setOverrideDesc(() => options?.desc);
    setOverrideType(options?.type);
    setOpen(true);
  };

  const ConfirmDialog = () => {
    const mergedDesc = overrideDesc ?? desc;
    const mergedType = overrideType ?? type;

    const description =
      typeof mergedDesc === "function" && payload !== undefined
        ? mergedDesc(payload)
        : typeof mergedDesc === "string"
        ? mergedDesc
        : "Bạn có chắc chắn muốn tiếp tục không?";

    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader className="items-center">
            <AlertDialogTitle>
              <div
                className={`mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
                  mergedType === "warn" ? "bg-orange-500/10" : "bg-primary/10"
                }`}
              >
                <OctagonAlert className={`h-7 w-7 ${mergedType === "warn" ? "text-orange-500" : "text-primary"}`} />
              </div>
              Bạn có chắc chắn muốn tiếp tục không?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[15px] text-center">{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2 sm:justify-center">
            <AlertDialogCancel className={buttonVariants({ variant: "outline" })} onClick={() => setOpen(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({
                variant: mergedType === "warn" ? "upload" : "default",
              })}
              onClick={async () => {
                // Ép kiểu vì bạn đảm bảo đã truyền payload ở openDialog
                const ok = await onConfirm(payload as T);
                if (ok) {
                  setOpen(false);
                }
              }}
            >
              <span className="text-white">Xác nhận</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return {
    ConfirmDialog,
    openDialog,
  };
};
