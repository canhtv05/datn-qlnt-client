import { Input } from "./ui/input";
import { Label } from "./ui/label";
import React from "react";

interface InputLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  required?: boolean;
  errorText?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

const InputLabel = React.forwardRef<HTMLInputElement, InputLabelProps>(
  ({ id, label, required = false, className, errorText, onFocus, onBlur, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        <Label htmlFor={id} className="mb-1 text-label text-sm flex gap-1">
          {label}
          {required && <span className="text-[10px] text-red-500">(*)</span>}
        </Label>
        <Input
          errorText={errorText}
          validate={required}
          id={id}
          ref={ref}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`mt-0.5 text-label text-sm dark:bg-transparent border-input ${className}`}
          {...props}
        />
      </div>
    );
  }
);

InputLabel.displayName = "InputLabel";

export default InputLabel;
