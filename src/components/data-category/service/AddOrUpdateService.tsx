import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { ServiceCalculation, ServiceCategory, ServiceStatus } from "@/enums";
import { ServiceCreationRequest, ServiceUpdateRequest } from "@/types";
import { Dispatch } from "react";

interface AddServiceProps {
  value: ServiceCreationRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ServiceCreationRequest>>;
  errors: Partial<Record<keyof ServiceCreationRequest, string>>;
  type: "add";
}

interface UpdateServiceProps {
  value: ServiceUpdateRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<ServiceUpdateRequest>>;
  errors: Partial<Record<keyof ServiceUpdateRequest, string>>;
  type: "update";
}

type AddOrUpdateServiceProps = AddServiceProps | UpdateServiceProps;

const AddOrUpdateService = ({ value, handleChange, setValue, errors, type }: AddOrUpdateServiceProps) => {
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
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          label="Loại dịch vụ"
          placeholder="-- Loại dịch vụ --"
          labelSelect="Loại dịch vụ"
          data={[
            { label: "An ninh", value: ServiceCategory.AN_NINH },
            { label: "Bảo trì", value: ServiceCategory.BAO_TRI },
            { label: "Điện", value: ServiceCategory.DIEN },
            { label: "Giặt sấy", value: ServiceCategory.GIAT_SAY },
            { label: "Gửi xe", value: ServiceCategory.GUI_XE },
            { label: "Internet", value: ServiceCategory.INTERNET },
            { label: "Nước", value: ServiceCategory.NUOC },
            { label: "Thang máy", value: ServiceCategory.THANG_MAY },
            { label: "Tiền phòng", value: ServiceCategory.TIEN_PHONG },
            { label: "Vệ sinh", value: ServiceCategory.VE_SINH },
            { label: "Khác", value: ServiceCategory.KHAC },
          ]}
          value={value.serviceCategory ?? ""}
          onChange={(value) => {
            if (type === "add") setValue((prev) => ({ ...prev, serviceCategory: value as ServiceCategory }));
            else setValue((prev) => ({ ...prev, serviceCategory: value as ServiceCategory }));
          }}
          name="serviceCategory"
          id="serviceCategory"
          required
          showClear
          errorText={errors.serviceCategory}
        />
        <FieldsSelectLabel
          label="Tính toán dịch vụ"
          placeholder="-- Tính toán dịch vụ --"
          labelSelect="Tính toán dịch vụ"
          data={[
            { label: "Tính theo người", value: ServiceCalculation.TINH_THEO_NGUOI },
            { label: "Tính theo phòng", value: ServiceCalculation.TINH_THEO_PHONG },
            { label: "TÍnh theo phương tiện", value: ServiceCalculation.TINH_THEO_PHUONG_TIEN },
            { label: "Tính theo số", value: ServiceCalculation.TINH_THEO_SO },
          ]}
          value={value.serviceCalculation ?? ""}
          onChange={(value) => {
            if (type === "add") setValue((prev) => ({ ...prev, serviceCalculation: value as ServiceCalculation }));
            else setValue((prev) => ({ ...prev, serviceCalculation: value as ServiceCalculation }));
          }}
          name="serviceCalculation"
          id="serviceCalculation"
          showClear
          required
          errorText={errors.serviceCalculation}
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

      {type === "update" && (
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
      )}

      <TextareaLabel
        id="description"
        name="description"
        placeholder="Nhập mô tả"
        label="Mô tả:"
        value={value.description ?? ""}
        onChange={(e) => {
          if (type === "add") setValue((prev) => ({ ...prev, description: e.target.value }));
          else setValue((prev) => ({ ...prev, description: e.target.value }));
        }}
        errorText={errors.description}
      />
    </div>
  );
};

export default AddOrUpdateService;
