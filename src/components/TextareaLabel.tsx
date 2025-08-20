import { forwardRef } from "react";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface TextareaLabelProps extends React.InputHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  required?: boolean;
  errorText?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

const TextareaLabel = forwardRef<HTMLTextAreaElement, TextareaLabelProps>(
  ({ id, label, required = false, className, errorText, onFocus, onBlur, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        <Label htmlFor={id} className="mb-1 text-label text-sm flex gap-1">
          {label}
          {required && <span className="text-[10px] text-red-500">(*)</span>}
        </Label>
        <Textarea
          errorText={errorText}
          validate={required}
          id={id}
          ref={ref}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`text-sm dark:bg-transparent resize-y text-foreground border-input ${className}`}
          {...props}
        />
      </div>
    );
  }
);

TextareaLabel.displayName = "TextareaLabel";

export default TextareaLabel;
