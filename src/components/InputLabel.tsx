import { Input } from "./ui/input";
import { Label } from "./ui/label";
import React from "react";

interface InputLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  required?: boolean;
  errorText?: string;
  onFocus?: () => void;
}

const InputLabel = React.forwardRef<HTMLInputElement, InputLabelProps>(
  ({ id, label, required, className, errorText, onFocus, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        <Label htmlFor={id} className="mb-1 text-[#6e6b7b] text-sm flex gap-1">
          {label}
          {required && <span className="text-[10px] text-red-500">(*)</span>}
        </Label>
        <Input
          errorText={errorText}
          validate={required}
          id={id}
          ref={ref}
          onFocus={onFocus}
          className={`mt-0.5 text-[#6e6b7b] text-sm ${className}`}
          {...props}
        />
      </div>
    );
  }
);

InputLabel.displayName = "InputLabel";

export default InputLabel;
