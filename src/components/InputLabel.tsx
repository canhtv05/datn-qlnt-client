import { Input } from "./ui/input";
import { Label } from "./ui/label";
import React, { ReactNode } from "react";

interface InputLabelProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: string;
  required?: boolean;
  errorText?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  icon?: ReactNode;
  name: string;
}

const InputLabel = React.forwardRef<HTMLInputElement, InputLabelProps>(
  (
    { id, label, required = false, className, errorText, onFocus, onBlur, icon, type = "text", name, ...props },
    ref
  ) => {
    return (
      <div className="flex flex-col w-full">
        <Label htmlFor={id} className="mb-1 text-label text-sm flex gap-1">
          {label}
          {required && <span className="text-[10px] text-red-500">(*)</span>}
        </Label>
        <Input
          type={type}
          errorText={errorText}
          validate={required}
          id={id}
          ref={ref}
          onFocus={onFocus}
          onBlur={onBlur}
          name={name}
          icon={icon}
          className={`mt-0.5 text-label text-sm dark:bg-transparent border-input ${className}`}
          {...props}
        />
      </div>
    );
  }
);

InputLabel.displayName = "InputLabel";

export default InputLabel;
