import { ChevronDown } from "lucide-react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Dispatch, SetStateAction, useEffect } from "react";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import RenderIf from "./RenderIf";

interface FieldsSelectLabelType {
  label: string;
  value: string | number;
}

interface FieldsSelectLabelProps {
  data: FieldsSelectLabelType[];
  placeholder: string;
  label?: string;
  id?: string;
  defaultValue?: string;
  resetValue?: boolean;
  value: string | undefined;
  onChange: Dispatch<SetStateAction<string>>;
  labelSelect: string;
  classNameTrigger?: string;
}

const FieldsSelectLabel = ({
  data,
  placeholder,
  label,
  id,
  defaultValue,
  resetValue,
  value,
  onChange,
  labelSelect,
  classNameTrigger,
}: FieldsSelectLabelProps) => {
  useEffect(() => {
    if (defaultValue && !value) {
      onChange(defaultValue);
    }
  }, [defaultValue, onChange, value]);

  useEffect(() => {
    if (resetValue) {
      onChange("");
    }
  }, [resetValue, onChange]);

  const handleChange = (val: string) => {
    onChange(val);
  };

  return (
    <div className="flex flex-col">
      <RenderIf value={!!label}>
        <Label htmlFor={id} className="mb-1 text-label text-sm flex gap-1">
          {label}
        </Label>
      </RenderIf>
      <Select value={value} onValueChange={handleChange}>
        <SelectPrimitive.Trigger
          className={cn(
            "flex h-9 cursor-pointer !w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
            "w-44 text-foreground",
            classNameTrigger
          )}
          id={id}
        >
          <SelectValue placeholder={placeholder} className="bg-emerald-500" />
          <SelectPrimitive.Icon asChild>
            <ChevronDown className="h-4 w-4 opacity-50 ml-2" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
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
      </Select>
    </div>
  );
};

export default FieldsSelectLabel;
