import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { ServiceCategory } from "@/enums";
import { InvoiceDetailUpdateRequest } from "@/types";
import { Dispatch } from "react";

interface UpdateItemInvoiceDetailProps {
  value: InvoiceDetailUpdateRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<InvoiceDetailUpdateRequest>>;
  errors: Partial<Record<keyof InvoiceDetailUpdateRequest, string>>;
  type: string;
}

const UpdateItemInvoiceDetail = ({ value, handleChange, setValue, errors, type }: UpdateItemInvoiceDetailProps) => {
  return (
    <div className="flex flex-col gap-3">
      {type === ServiceCategory.DEN_BU && (
        <>
          <InputLabel
            id="serviceName"
            name="serviceName"
            placeholder="Tên dịch vụ"
            label="Tên dịch vụ:"
            value={value.serviceName ?? ""}
            onChange={handleChange}
            errorText={errors.serviceName}
          />
          <InputLabel
            id="quantity"
            name="quantity"
            placeholder="100"
            type="number"
            label="Số lượng:"
            required
            value={value.quantity ?? ""}
            onChange={handleChange}
            errorText={errors.quantity}
          />
          <InputLabel
            id="unitPrice"
            name="unitPrice"
            placeholder="100"
            type="number"
            label="Đơn giá:"
            required
            value={value.unitPrice ?? ""}
            onChange={handleChange}
            errorText={errors.unitPrice}
          />
        </>
      )}

      {(type === ServiceCategory.DIEN || type === ServiceCategory.NUOC) && (
        <InputLabel
          id="newIndex"
          name="newIndex"
          placeholder="100"
          type="number"
          label="Chỉ số mới:"
          value={value.newIndex ?? ""}
          onChange={handleChange}
          errorText={errors.newIndex}
          required
        />
      )}

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

export default UpdateItemInvoiceDetail;
