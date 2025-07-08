import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { ServiceAppliedBy, ServiceStatus, ServiceType } from "@/enums";
import { ServiceCreationAndUpdateRequest } from "@/types";
import { Dispatch } from "react";

interface AddOrUpdateServiceProps {
  value: ServiceCreationAndUpdateRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ServiceCreationAndUpdateRequest>>;
  errors: Partial<Record<keyof ServiceCreationAndUpdateRequest, string>>;
}

const AddOrUpdateService = ({ value, handleChange, setValue, errors }: AddOrUpdateServiceProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full items-end">
        <InputLabel
          id="name"
          name="name"
          placeholder="Quét dọn"
          label="Tên dịch vụ:"
          required
          value={value.name ?? ""}
          onChange={handleChange}
          errorText={errors.name}
        />
        <InputLabel
          id="unit"
          name="unit"
          placeholder="1 ngày dùng dịch vụ"
          label="Đơn vị:"
          required
          value={value.unit ?? ""}
          onChange={handleChange}
          errorText={errors.unit}
        />
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          label="Loại dịch vụ"
          placeholder="-- Loại dịch vụ --"
          labelSelect="Loại dịch vụ"
          data={[
            { label: "Cố định", value: ServiceType.CO_DINH },
            { label: "Tính theo số", value: ServiceType.TINH_THEO_SO },
          ]}
          value={value.type ?? ""}
          id="type"
          onChange={(value) => setValue((prev) => ({ ...prev, type: value as ServiceType }))}
          name="type"
          required
          showClear
          errorText={errors.type}
        />
        <FieldsSelectLabel
          label="Dịch vụ áp dụng cho"
          placeholder="-- Dịch vụ áp dụng cho --"
          labelSelect="Dịch vụ áp dụng cho"
          data={[
            { label: "Tầng", value: ServiceAppliedBy.TANG },
            { label: "Phòng", value: ServiceAppliedBy.PHONG },
            { label: "Cố định", value: ServiceAppliedBy.NGUOI },
          ]}
          value={value.appliedBy ?? ""}
          onChange={(value) => setValue((prev) => ({ ...prev, appliedBy: value as ServiceAppliedBy }))}
          name="appliedBy"
          id="appliedBy"
          required
          showClear
          errorText={errors.appliedBy}
        />
        <FieldsSelectLabel
          label="Trạng thái"
          placeholder="-- Trạng thái --"
          labelSelect="Trạng thái"
          data={[
            { label: "Hoạt động", value: ServiceStatus.HOAT_DONG },
            { label: "Tạm khóa", value: ServiceStatus.TAM_KHOA },
          ]}
          value={value.status ?? ""}
          onChange={(value) => setValue((prev) => ({ ...prev, status: value as ServiceStatus }))}
          name="status"
          id="status"
          showClear
          required
          errorText={errors.status}
        />
      </div>

      <InputLabel
        id="price"
        name="price"
        placeholder="3000000"
        type="text"
        label="Giá (VNĐ):"
        required
        value={value.price ?? ""}
        onChange={handleChange}
        errorText={errors.price}
      />

      <TextareaLabel
        id="description"
        name="description"
        placeholder="Nhập mô tả"
        label="Mô tả:"
        value={value.description ?? ""}
        onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
        errorText={errors.description}
      />
    </div>
  );
};

export default AddOrUpdateService;
