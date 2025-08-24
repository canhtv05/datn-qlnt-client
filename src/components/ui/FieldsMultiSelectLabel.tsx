import { useState } from "react";
import Select, { components } from "react-select";
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
  renderValue?: (option: FieldsSelectLabelType) => React.ReactNode;
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
  renderValue,
}: FieldsMultiSelectLabelProps) => {
  const [touched, setTouched] = useState(false);
  const { theme } = useTheme();

  const isInvalid = required && touched && value.length === 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomMultiValueLabel = (props: any) => {
    const option = props.data as FieldsSelectLabelType;
    if (renderValue) {
      return (
        <div
          className="flex items-center gap-2 py-1 pl-1"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {renderValue(option)}
        </div>
      );
    }
    return <components.MultiValueLabel {...props} />;
  };

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
        components={{
          MultiValueLabel: CustomMultiValueLabel,
        }}
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
            cursor: "pointer",
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
            // backgroundColor: "var(--color-primary)",
            background: theme === "dark" ? "#44475a" : "#ebebec",
            opacity: 0.7,
            // color: "black",
            color: theme === "dark" ? "#ebebec" : "#44475a",
            // borderBlockEnd: "1px solid white",
            ":hover": {
              cursor: "pointer",
              background: "var(--color-primary)",
              color: "white",
            },
          }),
          noOptionsMessage: (base) => ({
            ...base,
            background: theme === "dark" ? "#44475a" : "#ebebec",
            fontSize: 14,
            color: theme === "dark" ? "#ebebec" : "#44475a",
            ":hover": {
              cursor: "default",
            },
          }),
          menuList: (base) => ({
            ...base,
            padding: 0,
            borderRadius: 6,
            ":hover": {
              cursor: "pointer",
            },
          }),
          menu: (base) => ({
            ...base,
            borderRadius: 6,
            ":hover": {
              cursor: "pointer",
            },
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
