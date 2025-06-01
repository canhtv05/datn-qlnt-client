import * as React from "react";
import { CircleAlert, Eye, EyeClosed } from "lucide-react";
import { cn } from "@/lib/utils";
import RenderIf from "../RenderIf";
import usePrevious from "@/hooks/usePrevious";

function Input({
  className,
  validate,
  errorText,
  onFocus,
  type,
  ...props
}: React.ComponentProps<"input"> & { validate?: boolean; errorText?: string; onFocus?: () => void }) {
  const [isEmpty, setIsEmpty] = React.useState(false);
  const [typeInput, setTypeInput] = React.useState(type);

  const prevType = usePrevious(typeInput || "text");

  const handleBlur = (value: string) => {
    if (!value.trim() || value.startsWith(" ")) {
      setIsEmpty(true);
    }
  };

  const togglePasswordVisibility = () => {
    setTypeInput((prev) => (prev === "password" ? "text" : "password"));
  };

  const handleFocus = () => {
    setIsEmpty(false);
    onFocus?.();
  };

  return (
    <>
      <div className="relative">
        <input
          type={typeInput}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-foreground/50 dark:bg-input/30 flex h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[0.5px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            "focus-visible:transform focus-visible:placeholder:translate-x-[2px] not-focus-visible:placeholder:-translate-x-[2px] focus-visible:placeholder:transition-transform focus-visible:placeholder:duration-300 not-focus-visible:placeholder:duration-300",
            "focus-visible:shadow-lg placeholder:pl-1 disabled:border-[oklch(1 0 0 / 15%)] disabled:bg-[#efefef] placeholder:text-[rgb(110,107,123)/50] border-[#00000026]",
            validate && isEmpty && "border-red-500",
            (typeInput === "password" || prevType === "password") && "pr-11",
            className
          )}
          onBlur={(e) => handleBlur(e.target.value)}
          onFocus={handleFocus}
          {...props}
        />

        <RenderIf value={isEmpty}>
          <CircleAlert
            className={`absolute ${
              typeInput === "password" || prevType === "password" ? "right-12" : "right-4"
            } top-1/2 -translate-y-1/2 size-[14px] stroke-red-500`}
          />
        </RenderIf>

        {type === "password" && (
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 size-[16px] cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {typeInput === "password" ? (
              <Eye className="absolute right-0 top-1/2 -translate-y-1/2 size-[16px] cursor-pointer stroke-[#6e6b7b]" />
            ) : (
              <EyeClosed className="absolute right-0 top-1/2 -translate-y-1/2 size-[16px] cursor-pointer stroke-[#6e6b7b]" />
            )}
          </div>
        )}
      </div>

      <RenderIf value={isEmpty}>
        <span className="text-[12px] text-red-500 font-light">Thông tin bắt buộc</span>
      </RenderIf>
      <RenderIf value={!!errorText?.trim() && !isEmpty}>
        <span className="text-[12px] text-red-500 font-light">{errorText}</span>
      </RenderIf>
    </>
  );
}

export { Input };
