import DatePickerLabel from "@/components/DatePickerLabel";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { VehicleStatus, VehicleType } from "@/enums";
import { ICreateVehicle } from "@/types";
import { Dispatch } from "react";

interface AddOrUpdateVehicleProps {
  value: ICreateVehicle;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ICreateVehicle>>;
  errors: Partial<Record<keyof ICreateVehicle, string>>;
}

const vehicleType: FieldsSelectLabelType[] = [
  {
    label: "Xe máy",
    value: VehicleType.XE_MAY,
  },
  {
    label: "Ô tô",
    value: VehicleType.O_TO,
  },
  {
    label: "Xe đạp",
    value: VehicleType.XE_DAP,
  },
  {
    label: "Khác",
    value: VehicleType.KHAC,
  },
];

const vehicleStatus: FieldsSelectLabelType[] = [
  {
    label: "Sử dụng",
    value: VehicleStatus.SU_DUNG,
  },
  {
    label: "Không sử dụng",
    value: VehicleStatus.TAM_KHOA,
  },
];

const AddOrUpdateVehicle = ({ value, handleChange, setValue, errors }: AddOrUpdateVehicleProps) => {
  return (
    <div className="flex flex-col gap-3">
      thieu tenantId
      <FieldsSelectLabel
        data={vehicleType}
        placeholder="-- Chọn loại xe --"
        label="Loại xe:"
        id="vehicleType"
        name="vehicleType"
        value={value.vehicleType ?? ""}
        onChange={(val) => setValue((prev) => ({ ...prev, vehicleType: val as VehicleType }))}
        labelSelect="Loại xe"
        showClear
        errorText={errors.vehicleType}
        required
      />
      <FieldsSelectLabel
        data={vehicleStatus}
        placeholder="-- Chọn loại xe --"
        label="Loại xe:"
        id="vehicleStatus"
        name="vehicleStatus"
        value={value.vehicleStatus ?? ""}
        onChange={(val) => setValue((prev) => ({ ...prev, vehicleStatus: val as VehicleStatus }))}
        labelSelect="Loại xe"
        showClear
        errorText={errors.vehicleStatus}
        required
      />
      <InputLabel
        id="licensePlate"
        name="licensePlate"
        placeholder="30A-123.45"
        required
        label="Biển số xe:"
        value={value.licensePlate ?? ""}
        onChange={handleChange}
        errorText={errors.licensePlate}
      />
      <DatePickerLabel
        date={value?.registrationDate ? new Date(value?.registrationDate) : new Date()}
        setDate={(d) => setValue((prev) => ({ ...prev, registrationDate: d.toISOString() }))}
        label="Ngày đăng ký:"
        errorText={errors?.registrationDate}
      />
      <TextareaLabel
        id="describe"
        name="describe"
        placeholder="Nhập mô tả"
        label="Mô tả:"
        value={value.describe ?? ""}
        onChange={(e) => setValue((prev) => ({ ...prev, describe: e.target.value }))}
      />
    </div>
  );
};

export default AddOrUpdateVehicle;
