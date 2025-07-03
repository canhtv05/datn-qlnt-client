import DatePickerLabel from "@/components/DatePickerLabel";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { GENDER_OPTIONS } from "@/constant";
import { ICreateAndUpdateTenant } from "@/types";
import { Dispatch } from "react";

interface AddOrUpdateTenantProps {
  value: ICreateAndUpdateTenant;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ICreateAndUpdateTenant>>;
  errors: Partial<Record<keyof ICreateAndUpdateTenant, string>>;
}

const AddOrUpdateTenant = ({ value, handleChange, setValue, errors }: AddOrUpdateTenantProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
        <InputLabel
          id="fullName"
          name="fullName"
          placeholder="Nhập họ và tên"
          required
          label="Nhập họ và tên:"
          value={value.fullName ?? ""}
          onChange={handleChange}
          errorText={errors.fullName}
        />
        <FieldsSelectLabel
          data={GENDER_OPTIONS}
          placeholder="-- Chọn giới tính --"
          label="Giới tính:"
          id="gender"
          name="gender"
          value={value.gender ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, gender: String(val) }))}
          labelSelect="Giới tính"
          showClear
          errorText={errors.gender}
          required
        />
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
        <DatePickerLabel
          date={value?.dob ? new Date(value?.dob) : new Date()}
          setDate={(d) => setValue((prev) => ({ ...prev, dob: d.toISOString() }))}
          label="Ngày sinh:"
          errorText={errors?.dob}
          required
        />
        <InputLabel
          id="phoneNumber"
          name="phoneNumber"
          placeholder="0987654321"
          required
          label="Số điện thoại:"
          value={value.phoneNumber ?? ""}
          onChange={handleChange}
          errorText={errors.phoneNumber}
        />
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
        <InputLabel
          id="email"
          name="email"
          placeholder="Nhập email"
          required
          label="Nhập email:"
          value={value.email ?? ""}
          onChange={handleChange}
          errorText={errors.email}
        />

        <InputLabel
          id="identityCardNumber"
          name="identityCardNumber"
          placeholder="Nhập căn cước công dân"
          required
          label="Nhập căn cước công dân"
          value={value.identityCardNumber ?? ""}
          onChange={handleChange}
          errorText={errors.identityCardNumber}
        />
      </div>

      <TextareaLabel
        required
        errorText={errors.address}
        id="address"
        name="address"
        placeholder="Nhập địa chỉ"
        label="Địa chỉ:"
        value={value.address ?? ""}
        onChange={(e) => setValue((prev) => ({ ...prev, address: e.target.value }))}
      />
    </div>
  );
};

export default AddOrUpdateTenant;
