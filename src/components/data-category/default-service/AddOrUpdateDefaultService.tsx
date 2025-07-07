import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { AssetGroup, DefaultServiceAppliesTo, DefaultServiceStatus } from "@/enums";
import { DefaultServiceCreationRequest, DefaultServiceUpdateRequest } from "@/types";
import { Dispatch } from "react";

type AddDefaultServiceProps = {
  type: "add";
  value: DefaultServiceCreationRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<DefaultServiceCreationRequest>>;
  errors: Partial<Record<keyof DefaultServiceCreationRequest, string>>;
};

interface UpdateDefaultServiceProps {
  value: DefaultServiceUpdateRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<DefaultServiceUpdateRequest>>;
  errors: Partial<Record<keyof DefaultServiceUpdateRequest, string>>;
  type: "update";
}

type AddOrUpdateDefaultServiceProps = AddDefaultServiceProps | UpdateDefaultServiceProps;

const appliesTo: FieldsSelectLabelType[] = [
  {
    label: "Hợp đồng",
    value: DefaultServiceAppliesTo.HOP_DONG,
  },
  {
    label: "Phòng",
    value: DefaultServiceAppliesTo.PHONG,
  },
];

const defaultServiceStatus: FieldsSelectLabelType[] = [
  {
    label: "Hoạt động",
    value: DefaultServiceStatus.HOAT_DONG,
  },
  {
    label: "Tạm ngưng",
    value: DefaultServiceStatus.TAM_NGUNG,
  },
];

const AddOrUpdateDefaultService = ({ value, handleChange, setValue, errors, type }: AddOrUpdateDefaultServiceProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
        <FieldsSelectLabel
          data={appliesTo}
          placeholder="-- Chọn dịch vụ mặc định --"
          label="Dịch vụ mặc định:"
          id="buildingType"
          name="buildingType"
          value={value.defaultServiceAppliesTo ?? ""}
          onChange={(val) => {
            if (type === "add") {
              setValue((prev: DefaultServiceCreationRequest) => ({
                ...prev,
                defaultServiceAppliesTo: val as DefaultServiceAppliesTo,
              }));
            } else {
              setValue((prev: DefaultServiceUpdateRequest) => ({
                ...prev,
                defaultServiceAppliesTo: val as DefaultServiceAppliesTo,
              }));
            }
          }}
          labelSelect="Áp dụng cho"
          showClear
          errorText={errors.defaultServiceAppliesTo}
          required
        />

        <FieldsSelectLabel
          data={defaultServiceStatus}
          placeholder="-- Chọn trạng thái --"
          label="Trạng thái:"
          id="defaultServiceStatus"
          name="defaultServiceStatus"
          value={value.defaultServiceStatus ?? ""}
          onChange={(val) => {
            if (type === "add") {
              setValue((prev: DefaultServiceCreationRequest) => ({
                ...prev,
                defaultServiceStatus: val as DefaultServiceStatus,
              }));
            } else {
              setValue((prev: DefaultServiceUpdateRequest) => ({
                ...prev,
                defaultServiceStatus: val as DefaultServiceStatus,
              }));
            }
          }}
          labelSelect="Trạng thái"
          showClear
          errorText={errors.defaultServiceStatus}
          required
        />
      </div>

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

      <TextareaLabel
        id="description"
        name="description"
        placeholder="Nhập mô tả"
        label="Mô tả:"
        value={value.description ?? ""}
        onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
        errorText={errors.description}
        required
      />
    </div>
  );
};

export default AddOrUpdateDefaultService;
