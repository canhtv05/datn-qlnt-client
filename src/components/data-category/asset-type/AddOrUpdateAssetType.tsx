import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { AssetGroup } from "@/enums";
import { ICreateAssetType } from "@/types";
import { Dispatch } from "react";

interface AddOrUpdateAssetTypeProps {
  value: ICreateAssetType;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ICreateAssetType>>;
  errors: Partial<Record<keyof ICreateAssetType, string>>;
}

const AssetTypes: FieldsSelectLabelType[] = [
  {
    label: "Cá nhân",
    value: AssetGroup.CA_NHAN,
  },
  {
    label: "Điện",
    value: AssetGroup.DIEN,
  },
  {
    label: "Gia dụng",
    value: AssetGroup.GIA_DUNG,
  },
  {
    label: "Nội thất",
    value: AssetGroup.NOI_THAT,
  },
  {
    label: "Khác",
    value: AssetGroup.KHAC,
  },
];

const AddOrUpdateAssetType = ({ value, handleChange, setValue, errors }: AddOrUpdateAssetTypeProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
        <InputLabel
          id="nameAssetType"
          name="nameAssetType"
          placeholder="Điều hòa"
          required
          label="Tên loại tài sản:"
          value={value.nameAssetType ?? ""}
          onChange={handleChange}
          errorText={errors.nameAssetType}
        />

        <FieldsSelectLabel
          data={AssetTypes}
          placeholder="-- Chọn nhóm tài sản --"
          label="Nhóm tài sản:"
          id="buildingType"
          name="buildingType"
          value={value.assetGroup ?? ""}
          onChange={(val) => setValue((prev) => ({ ...prev, assetGroup: val as AssetGroup }))}
          labelSelect="Tài sản"
          showClear
          errorText={errors.assetGroup}
          required
        />
      </div>

      <TextareaLabel
        id="discriptionAssetType"
        name="discriptionAssetType"
        placeholder="Nhập mô tả"
        label="Mô tả:"
        value={value.discriptionAssetType ?? ""}
        onChange={(e) => setValue((prev) => ({ ...prev, discriptionAssetType: e.target.value }))}
        errorText={errors.discriptionAssetType}
        required
      />
    </div>
  );
};

export default AddOrUpdateAssetType;
