import { forwardRef } from "react";

import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "./ui/label";
import RenderIf from "./RenderIf";

interface InputOTPProps {
  id: string;
  label: string;
  required?: boolean;
  errorText?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  maxLength?: number;
  value?: string;
  onChange?: (value: string) => void;
}

const InputOTPLabel = forwardRef<HTMLDivElement, InputOTPProps>(
  ({ id, label, required, errorText, maxLength = 4, onFocus, onChange, onBlur, ...props }, ref) => {
    return (
      <div className="flex flex-col" ref={ref}>
        <Label htmlFor={id} className="mb-1 text-[#6e6b7b] text-sm flex gap-1">
          {label}
          {required && <span className="text-[10px] text-red-500">(*)</span>}
        </Label>
        <InputOTP maxLength={maxLength} {...props} id={id} onChange={onChange} onFocus={onFocus} onBlur={onBlur}>
          <InputOTPGroup className="space-x-2">
            {Array.from({ length: maxLength })
              .fill(null)
              .map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="rounded-md border border-[#00000026] bg-white text-[#6e6b7b] text-sm w-10 h-10"
                />
              ))}
          </InputOTPGroup>
        </InputOTP>
        <RenderIf value={!!errorText?.trim()}>
          <span className="text-[12px] text-red-500 font-light">{errorText}</span>
        </RenderIf>
      </div>
    );
  }
);

InputOTPLabel.displayName = "InputOTPLabel";

export default InputOTPLabel;
