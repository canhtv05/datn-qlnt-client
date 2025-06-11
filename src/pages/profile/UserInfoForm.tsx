import React from "react";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/DatePicker";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { Gender } from "@/enums";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";

interface UserInfoFormValue {
  fullName: string;
  email: string;
  gender: Gender;
  dob: string;
  phoneNumber: string;
}

interface UserInfoFormProps {
  value: UserInfoFormValue;
  errors: Partial<Record<keyof UserInfoFormValue, string>>;
  loading: boolean;
  onChange: (key: keyof UserInfoFormValue, val: any) => void;
  onBlurFullName: () => void;
}

const genderData = [
  { label: "Nam", value: Gender.MALE },
  { label: "Nữ", value: Gender.FEMALE },
];

const UserInfoForm: React.FC<UserInfoFormProps> = ({
  value,
  errors,
  loading,
  onChange,
  onBlurFullName,
}) => {
  return (
    <div className="flex-1 flex flex-col gap-3">
      <InputLabel
        type="text"
        id="email"
        name="email"
        label="Email:"
        placeholder="Nhập email"
        value={value.email}
        disabled
      />
      <InputLabel
        type="text"
        id="fullName"
        name="fullName"
        label="Tên người dùng:"
        placeholder="Nhập tên người dùng"
        value={value.fullName}
        onChange={(e) => onChange("fullName", e.target.value)}
        onBlur={onBlurFullName}
        errorText={errors.fullName}
      />
      <FieldsSelectLabel
        id="gender"
        placeholder="Giới tính"
        label="Giới tính:"
        labelSelect="Giới tính"
        data={genderData}
        value={value.gender}
        onChange={(val) => onChange("gender", val as Gender)}
      />
      <div className="flex flex-col">
        <Label htmlFor="dob" className="mb-1 text-label text-sm flex gap-1">
          Ngày sinh:
        </Label>
        <DatePicker
          value={value.dob ? new Date(value.dob) : undefined}
          onChange={(date) => {
            if (!date) {
              onChange("dob", "");
              return;
            }
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, "0");
            const day = date.getDate().toString().padStart(2, "0");
            onChange("dob", `${year}-${month}-${day}`);
          }}
        />
      </div>
      <InputLabel
        type="text"
        id="phoneNumber"
        name="phoneNumber"
        label="Số điện thoại:"
        placeholder="Nhập số điện thoại"
        value={value.phoneNumber}
        onChange={(e) => onChange("phoneNumber", e.target.value)}
        errorText={errors.phoneNumber}
      />
      <div className="flex justify-end gap-3 mt-4">
        <DialogClose asChild>
          <Button variant="ghost">Hủy</Button>
        </DialogClose>
        <Button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : <span className="text-white">Cập nhật</span>}
        </Button>
      </div>
    </div>
  );
};

export default UserInfoForm;
