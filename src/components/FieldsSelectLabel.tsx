import { ChevronDown, X } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import RenderIf from "./RenderIf";

export interface FieldsSelectLabelType {
  label: string;
  value: string | number;
}

interface FieldsSelectLabelProps {
  data: FieldsSelectLabelType[];
  placeholder: string;
  label?: string;
  id?: string;
  name?: string;
  defaultValue?: string;
  resetValue?: boolean;
  value: string | undefined;
  onChange: Dispatch<SetStateAction<string>>;
  labelSelect?: string;
  classNameTrigger?: string;
  required?: boolean;
  errorText?: string;
  showClear?: boolean;
  disabled?: boolean;
}

const FieldsSelectLabel = ({
  data,
  placeholder,
  label,
  id,
  name,
  defaultValue,
  resetValue,
  value,
  onChange,
  labelSelect,
  classNameTrigger,
  required,
  errorText,
  showClear,
  disabled,
  ...props
}: FieldsSelectLabelProps) => {
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (defaultValue && !value) {
      onChange(defaultValue);
    }
  }, [defaultValue, onChange, value]);

  useEffect(() => {
    if (resetValue) {
      onChange("");
      setTouched(false);
    }
  }, [resetValue, onChange]);

  const handleChange = (val: string) => {
    onChange(val);
    setTouched(true);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    setTouched(true);
  };

  const isInvalid = required && touched && !value;

  return (
    <div className="flex flex-col md:py-0 py-1">
      <RenderIf value={!!label}>
        <Label htmlFor={id} className="mb-1 text-label text-sm flex gap-1">
          {label}
          {required && <span className="text-[10px] text-red-500">(*)</span>}
        </Label>
      </RenderIf>

      <div className="relative w-full">
        <div className="flex items-center gap-2 relative">
          <Select value={value} onValueChange={handleChange} name={name} disabled={disabled}>
            <SelectPrimitive.Trigger
              className={cn(
                "flex h-9 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
                "text-foreground",
                classNameTrigger,
                isInvalid && "border-red-500"
              )}
              aria-autocomplete="none"
              {...props}
              id={id}
            >
              <SelectValue placeholder={placeholder} />
              <SelectPrimitive.Icon asChild>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>

            <RenderIf value={!!value && !!showClear}>
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-7 rounded-full px-2 py-1 text-sm text-foreground cursor-pointer"
              >
                <X className="w-4 h-4 opacity-50" />
              </button>
            </RenderIf>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>{labelSelect}</SelectLabel>
                {data
                  .filter((d) => d.label?.trim() !== "")
                  .map((d, index) => (
                    <SelectItem className="cursor-pointer" value={String(d.value)} key={index}>
                      {d.label}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
            <RenderIf value={!!isInvalid}>
              <span className="text-[12px] text-red-500 font-light absolute -bottom-5">Thông tin bắt buộc</span>
            </RenderIf>

            <RenderIf value={!!errorText}>
              <span className="text-[12px] text-red-500 font-light absolute -bottom-5">{errorText}</span>
            </RenderIf>
          </Select>
        </div>
        <RenderIf value={!!isInvalid || !!errorText}>
          <span className="block pb-4"></span>
        </RenderIf>
      </div>
    </div>
  );
};

export default FieldsSelectLabel;
