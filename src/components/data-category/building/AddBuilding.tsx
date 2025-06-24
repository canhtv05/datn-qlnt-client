import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { BuildingType } from "@/enums";
import { ICreateBuildingValue } from "@/types";
import { MapPin } from "lucide-react";
import { Dispatch, ReactNode } from "react";

interface AddBuildingProps {
  value: ICreateBuildingValue;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ICreateBuildingValue>>;
  errors: Partial<Record<keyof ICreateBuildingValue, string>>;
  address: ReactNode;
}

const buildingType: FieldsSelectLabelType[] = [
  {
    label: "Nhà trọ",
    value: BuildingType.NHA_TRO,
  },
  {
    label: "Căn hộ dịch vụ",
    value: BuildingType.CAN_HO_DICH_VU,
  },
  {
    label: "Chung cư mini",
    value: BuildingType.CHUNG_CU_MINI,
  },
  {
    label: "Khác",
    value: BuildingType.KHAC,
  },
];

const AddBuilding = ({ value, handleChange, setValue, errors, address: AddressForm }: AddBuildingProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-2 grid-cols-1 md:gap-5 gap-3">
        <InputLabel
          id="buildingName"
          name="buildingName"
          placeholder="Tên tòa nhà"
          required
          label="Tên tòa nhà:"
          value={value.buildingName ?? ""}
          onChange={handleChange}
          errorText={errors.buildingName}
        />
        <InputLabel
          id="buildingCode"
          name="buildingCode"
          placeholder="TN001"
          required
          label="Mã tòa nhà:"
          value={value.buildingCode ?? ""}
          onChange={handleChange}
          errorText={errors.buildingCode}
        />
      </div>

      {AddressForm}

      <InputLabel
        id="address"
        name="address"
        placeholder="16 Phạm Hùng"
        required
        label="Địa chỉ chi tiết:"
        icon={<MapPin className="size-4" />}
        value={value.address ?? ""}
        onChange={handleChange}
        errorText={errors.address}
      />

      <FieldsSelectLabel
        data={buildingType}
        placeholder="-- Chọn loại tòa nhà --"
        label="Loại tòa nhà:"
        id="buildingType"
        name="buildingType"
        value={value.buildingType ?? ""}
        onChange={(val) => setValue((prev) => ({ ...prev, buildingType: val as BuildingType }))}
        labelSelect="Xã/Phường"
        required
        showClear
        errorText={errors.buildingType}
      />

      <InputLabel
        id="actualNumberOfFloors"
        name="actualNumberOfFloors"
        placeholder="1"
        required
        label="Số tầng thực tế:"
        value={value.actualNumberOfFloors ?? ""}
        onChange={handleChange}
        errorText={errors.actualNumberOfFloors?.toString()}
      />

      <InputLabel
        id="numberOfFloorsForRent"
        name="numberOfFloorsForRent"
        placeholder="1"
        required
        label="Số tầng cho thuê:"
        value={value.numberOfFloorsForRent ?? ""}
        onChange={handleChange}
        errorText={errors.numberOfFloorsForRent?.toString()}
      />

      <TextareaLabel
        id="description"
        name="description"
        placeholder="Nhập mô tả"
        label="Mô tả:"
        value={value.description ?? ""}
        onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
      />
    </div>
  );
};

export default AddBuilding;
