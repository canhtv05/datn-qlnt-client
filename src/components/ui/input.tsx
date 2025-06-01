import * as React from "react";
import { CircleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import RenderIf from "../RenderIf";

function Input({ className, type, validate, ...props }: React.ComponentProps<"input"> & { validate?: boolean }) {
  const [isEmpty, setIsEmpty] = React.useState<boolean>(false);
  const typeIsPassword = type === "password";

  const handleBlur = (value: string) => {
    if (!value.trim() || value.startsWith(" ")) {
      setIsEmpty(true);
    }
  };

  return (
    <>
      <div className="relative">
        <input
          type={type}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-foreground/50 dark:bg-input/30 border-[oklch(1 0 0 / 15%)] flex h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[0.5px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            "focus-visible:transform focus-visible:placeholder:translate-x-[2px] not-focus-visible:placeholder:-translate-x-[2px] focus-visible:placeholder:transition-transform focus-visible:placeholder:duration-300 not-focus-visible:placeholder:duration-300",
            "focus-visible:shadow-lg placeholder:pl-1",
            validate && isEmpty && "border-red-500",
            className
          )}
          onBlur={(e) => handleBlur(e.target.value)}
          onFocus={() => setIsEmpty(false)}
          {...props}
        />
        <RenderIf value={isEmpty}>
          <CircleAlert className="absolute right-2 top-1/2 -translate-y-1/2 size-[14px] stroke-red-500" />
        </RenderIf>
        <RenderIf value={typeIsPassword}>
          <CircleAlert className="absolute right-2 top-1/2 -translate-y-1/2 size-[14px] stroke-red-500" />
        </RenderIf>
      </div>
      <RenderIf value={isEmpty}>
        <span className="text-[12px] text-red-500 font-light">Thông tin bắt buộc</span>
      </RenderIf>
    </>
  );
}

export { Input };
