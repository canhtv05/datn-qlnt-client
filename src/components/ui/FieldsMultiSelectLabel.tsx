import { useState } from "react";
import Select from "react-select";
import { Label } from "./label";
import RenderIf from "../RenderIf";
import useTheme from "@/hooks/useTheme";

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
  const { theme } = useTheme();

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
        noOptionsMessage={() => "Không có dữ liệu"}
        inputId={id}
        name={name}
        placeholder={placeholder}
        isMulti
        isClearable={isClearable}
        isDisabled={isDisabled}
        options={data}
        value={value}
        onMenuClose={() => setTouched(true)}
        onChange={(selected) => onChange(selected as FieldsSelectLabelType[])}
        classNamePrefix="react-select"
        className={
          "rounded-md border shadow-sm text-sm focus:outline-none " +
          (isInvalid || errorText ? "border-red-500" : "border-input")
        }
        menuPortalTarget={typeof window !== "undefined" ? document.body : null}
        menuPosition="absolute"
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: isInvalid ? "#f87171" : base.borderColor,
            minHeight: "36px",
            fontSize: "14px",
            border: 2,
            boxShadow: state.isFocused ? "0 0 0 1px var(--color-primary)" : base.boxShadow,
            "&:hover": {
              borderColor: state.isFocused ? "var(--color-primary)" : base.borderColor,
            },
            borderRadius: "8px",
            background: "transparent",
          }),
          multiValueLabel: (base) => ({
            ...base,
            fontSize: "12px",
            color: "var(--color-background)",
          }),
          multiValue: (base) => ({
            ...base,
            background: "var(--color-foreground)",
            color: "var(--color-background)",
          }),
          menuPortal: (base) => ({
            ...base,
            zIndex: 9999,
          }),
          singleValue: (base) => ({
            ...base,
          }),
          option: (base) => ({
            ...base,
            fontSize: 14,
            backgroundColor: "var(--color-primary)",
            opacity: 0.7,
            color: "white",
            borderBlockEnd: "1px solid white",
          }),
          noOptionsMessage: (base) => ({
            ...base,
            background: theme === "dark" ? "#44475a" : "#ebebec",
            fontSize: 14,
            color: "var(--color-foreground)",
          }),
          menuList: (base) => ({
            ...base,
            padding: 0,
            borderRadius: 6,
          }),
          menu: (base) => ({
            ...base,
            borderRadius: 6,
          }),
        }}
      />

      <RenderIf value={!!isInvalid}>
        <span className="text-[12px] text-red-500 font-light mt-1">Thông tin bắt buộc</span>
      </RenderIf>

      <RenderIf value={!!errorText}>
        <span className="text-[12px] text-red-500 font-light mt-1">{errorText}</span>
      </RenderIf>
    </div>
  );
};

export default FieldsMultiSelectLabel;
