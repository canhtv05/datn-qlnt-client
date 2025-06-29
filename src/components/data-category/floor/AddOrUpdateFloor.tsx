import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import RenderIf from "@/components/RenderIf";
import TextareaLabel from "@/components/TextareaLabel";
import { FloorType } from "@/enums";
import { ICreateFloorValue } from "@/types";
import { Dispatch } from "react";

interface AddOrUpdateFloorProps {
  value: ICreateFloorValue;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ICreateFloorValue>>;
  errors: Partial<Record<keyof ICreateFloorValue, string>>;
  type: "add" | "update";
}

const floorType: FieldsSelectLabelType[] = [
  {
    label: "Cho thuê",
    value: FloorType.CHO_THUE,
  },
  {
    label: "Để ở",
    value: FloorType.DE_O,
  },
  {
    label: "Kho",
    value: FloorType.KHO,
  },
  {
    label: "Không cho thuê",
    value: FloorType.KHONG_CHO_THUE,
  },
  {
    label: "Khác",
    value: FloorType.KHAC,
  },
];

const AddOrUpdateFloor = ({ value, handleChange, setValue, errors, type }: AddOrUpdateFloorProps) => {
  return (
    <div className="flex flex-col gap-3">
      <RenderIf value={type === "add"}>
        <InputLabel
          id="nameFloor"
          name="nameFloor"
          placeholder="Tên tầng"
          required
          label="Tên tầng:"
          value={value.nameFloor ?? ""}
          onChange={handleChange}
          errorText={errors.nameFloor}
        />
      </RenderIf>

      <InputLabel
        id="maximumRoom"
        name="maximumRoom"
        placeholder="1"
        required
        label="Số phòng tối đa:"
        value={value.maximumRoom ?? ""}
        onChange={handleChange}
        errorText={errors.maximumRoom}
      />

      <FieldsSelectLabel
        data={floorType}
        placeholder="-- Chọn loại tầng --"
        label="Loại tầng:"
        id="buildingType"
        name="buildingType"
        value={value.floorType ?? ""}
        onChange={(val) => setValue((prev) => ({ ...prev, floorType: val as FloorType }))}
        labelSelect="Xã/Phường"
        showClear
        errorText={errors.floorType}
        required
      />

      <TextareaLabel
        id="descriptionFloor"
        name="descriptionFloor"
        placeholder="Nhập mô tả"
        label="Mô tả:"
        value={value.descriptionFloor ?? ""}
        onChange={(e) => setValue((prev) => ({ ...prev, descriptionFloor: e.target.value }))}
      />
    </div>
  );
};

export default AddOrUpdateFloor;
