import { useEffect, useState } from "react";
import Select from "react-select";
import { Label } from "./label";
import RenderIf from "../RenderIf";

export interface FieldsSelectLabelType {
  label: string;
  value: string | number;
}

interface FieldsMultiSelectLabelProps {
  data: FieldsSelectLabelType[];
  placeholder: string;
  label?: string;
  id?: string;
  name?: string;
  value: FieldsSelectLabelType[];
  onChange: (val: FieldsSelectLabelType[]) => void;
  required?: boolean;
  errorText?: string;
  isClearable?: boolean;
  isDisabled?: boolean;
}

const FieldsMultiSelectLabel = ({
  data,
  placeholder,
  label,
  id,
  name,
  value,
  onChange,
  required,
  errorText,
  isClearable = true,
  isDisabled = false,
}: FieldsMultiSelectLabelProps) => {
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setTouched(true);
  }, [value]);

  const isInvalid = required && touched && value.length === 0;

  return (
    <div className="flex flex-col md:py-0 py-1">
      <RenderIf value={!!label}>
        <Label htmlFor={id} className="mb-1 text-label text-sm flex gap-1">
          {label}
          {required && <span className="text-[10px] text-red-500">(*)</span>}
        </Label>
      </RenderIf>

      <Select
        inputId={id}
        name={name}
        placeholder={placeholder}
        isMulti
        isClearable={isClearable}
        isDisabled={isDisabled}
        options={data}
        value={value}
        onChange={(selected) => onChange(selected as FieldsSelectLabelType[])}
        classNamePrefix="react-select"
        className={
          "rounded-md border shadow-sm text-sm focus:outline-none " +
          (isInvalid || errorText ? "border-red-500" : "border-input")
        }
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: isInvalid ? "#f87171" : base.borderColor,
            minHeight: "36px",
            fontSize: "14px",
            boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : base.boxShadow,
            '&:hover': {
              borderColor: state.isFocused ? "#3b82f6" : base.borderColor,
            },
          }),
          multiValueLabel: (base) => ({
            ...base,
            fontSize: "13px",
          }),
        }}
      />

      <RenderIf value={!!isInvalid}>
        <span className="text-[12px] text-red-500 font-light mt-1">
          Thông tin bắt buộc
        </span>
      </RenderIf>

      <RenderIf value={!!errorText}>
        <span className="text-[12px] text-red-500 font-light mt-1">
          {errorText}
        </span>
      </RenderIf>
    </div>
  );
};

export default FieldsMultiSelectLabel;
