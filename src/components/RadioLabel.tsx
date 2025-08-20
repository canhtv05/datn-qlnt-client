import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "./ui/label";
import RenderIf from "./RenderIf";

export interface RadioOption {
  label: string;
  value: string | number | boolean;
}

interface RadioLabelProps {
  id?: string;
  label?: string;
  data: RadioOption[];
  name?: string;
  value: string | undefined | boolean;
  onChange: Dispatch<SetStateAction<string | boolean>>;
  defaultValue?: string;
  required?: boolean;
  errorText?: string;
  disabled?: boolean;
}

const RadioLabel = ({
  id,
  label,
  data,
  name,
  value,
  onChange,
  defaultValue,
  required,
  errorText,
  disabled,
}: RadioLabelProps) => {
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (defaultValue && !value) {
      onChange(defaultValue);
    }
  }, [defaultValue, onChange, value]);

  const handleChange = (val: string) => {
    onChange(val);
    setTouched(true);
  };

  const isInvalid = required && touched && !value;

  return (
    <div className="flex flex-col py-1">
      <RenderIf value={!!label}>
        <Label htmlFor={id} className="mb-1 text-label text-sm flex gap-1">
          {label}
          {required && <span className="text-[10px] text-red-500">(*)</span>}
        </Label>
      </RenderIf>

      <RadioGroup
        name={name}
        value={String(value)}
        onValueChange={handleChange}
        disabled={disabled}
        className="flex flex-col gap-2"
      >
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center space-x-2  cursor-pointer">
            <RadioGroupItem className="cursor-pointer" value={String(item.value)} id={`${id}-${idx}`} />
            <Label className="cursor-pointer" htmlFor={`${id}-${idx}`}>
              {item.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <RenderIf value={!!isInvalid}>
        <span className="text-[12px] text-red-500 font-light mt-1">Thông tin bắt buộc</span>
      </RenderIf>

      <RenderIf value={!!errorText}>
        <span className="text-[12px] text-red-500 font-light mt-1">{errorText}</span>
      </RenderIf>
    </div>
  );
};

export default RadioLabel;
