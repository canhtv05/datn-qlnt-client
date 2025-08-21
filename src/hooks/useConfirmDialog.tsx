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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
        : t("common.confirmDialog.confirm");

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
              {t("common.confirmDialog.confirm")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[15px] text-center">{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2 sm:justify-center">
            <AlertDialogCancel className={buttonVariants({ variant: "outline" })} onClick={() => setOpen(false)}>
              {t("common.button.cancel")}
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
              <span className="text-white"> {t("common.button.confirm")}</span>
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
