import * as React from "react";

import { cn } from "@/lib/utils";
import RenderIf from "../RenderIf";
import { CircleAlert } from "lucide-react";

function Textarea({
  className,
  validate,
  errorText,
  onFocus,
  onBlur,
  ...props
}: React.ComponentProps<"textarea"> & {
  validate?: boolean;
  errorText?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}) {
  const [isEmpty, setIsEmpty] = React.useState(false);

  const handleBlur = (value: string) => {
    if (!value.trim() || value.startsWith(" ")) {
      setIsEmpty(true);
    }
    onBlur?.();
  };

  const handleFocus = () => {
    setIsEmpty(false);
    onFocus?.();
  };

  return (
    <div className="relative mb-1">
      <textarea
        data-slot="textarea"
        className={cn(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[0.5px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        {...props}
        onBlur={(e) => handleBlur(e.target.value)}
        onFocus={handleFocus}
      />
      <RenderIf value={isEmpty && !!validate}>
        <CircleAlert className={`absolute right-4 top-[18px] -translate-y-1/2 size-[14px] stroke-red-500`} />
      </RenderIf>

      <RenderIf value={isEmpty && !!validate}>
        <span className="text-[12px] text-red-500 font-light text-left">Thông tin bắt buộc</span>
      </RenderIf>
      <span className="text-[12px] text-red-500 font-light text-left">{errorText}</span>
    </div>
  );
}

export { Textarea };
