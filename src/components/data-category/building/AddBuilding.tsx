import AddressForm from "@/components/data-category/building/AddressForm";
import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { BuildingType } from "@/enums";
import { MapPin } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface AddValue {
  buildingCode: string;
  buildingName: string;
  address: string;
  actualNumberOfFloors: number | undefined;
  numberOfFloorsForRent: number | undefined;
  buildingType: BuildingType | undefined;
  description: string;
}

interface AddBuildingProps {
  value: AddValue;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  provinceCode: string;
  districtCode: string;
  wardCode: string;
  setProvinceCode: Dispatch<SetStateAction<string>>;
  setDistrictCode: Dispatch<SetStateAction<string>>;
  setWardCode: Dispatch<SetStateAction<string>>;
  setProvinceName: Dispatch<SetStateAction<string>>;
  setDistrictName: Dispatch<SetStateAction<string>>;
  setWardName: Dispatch<SetStateAction<string>>;
  setValue: Dispatch<React.SetStateAction<AddValue>>;
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

const AddBuilding = ({
  value,
  handleChange,
  districtCode,
  wardCode,
  provinceCode,
  setDistrictCode,
  setWardCode,
  setProvinceCode,
  setProvinceName,
  setWardName,
  setDistrictName,
  setValue,
}: AddBuildingProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between gap-5">
        <InputLabel
          id="ten"
          name="buildingName"
          placeholder="Tên tòa nhà"
          required
          label="Tên tòa nhà:"
          value={value.buildingName}
          onChange={handleChange}
        />
        <InputLabel
          id="ma"
          name="buildingCode"
          placeholder="TN001"
          required
          label="Mã tòa nhà:"
          value={value.buildingCode}
          onChange={handleChange}
        />
      </div>

      <AddressForm
        districtCode={districtCode}
        provinceCode={provinceCode}
        wardCode={wardCode}
        setDistrictCode={setDistrictCode}
        setProvinceCode={setProvinceCode}
        setWardCode={setWardCode}
        onLocationChange={(province, district, ward) => {
          setProvinceName(province);
          setDistrictName(district);
          setWardName(ward);
        }}
      />

      <InputLabel
        id="address"
        name="address"
        placeholder="16 Phạm Hùng"
        required
        label="Địa chỉ chi tiết:"
        icon={<MapPin className="size-4" />}
        value={value.address}
        onChange={handleChange}
      />

      <FieldsSelectLabel
        data={buildingType}
        placeholder="-- Chọn loại tòa nhà --"
        label="Loại tòa nhà:"
        id="ward"
        value={value.buildingType}
        onChange={(val) => setValue((prev) => ({ ...prev, buildingType: val as BuildingType }))}
        labelSelect="Xã/Phường"
        required
        showClear
      />

      <InputLabel
        id="actualNumberOfFloors"
        name="actualNumberOfFloors"
        placeholder="1"
        required
        label="Số tầng thực tế:"
        value={value.actualNumberOfFloors}
        onChange={handleChange}
      />

      <InputLabel
        id="numberOfFloorsForRent"
        name="numberOfFloorsForRent"
        placeholder="1"
        required
        label="Số tầng cho thuê:"
        value={value.numberOfFloorsForRent}
        onChange={handleChange}
      />
      <TextareaLabel
        id="description"
        name="description"
        placeholder="Nhập mô tả"
        label="Mô tả:"
        value={value.description}
        required
        onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
      />
    </div>
  );
};

export default AddBuilding;
