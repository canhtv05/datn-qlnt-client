import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { ServiceCategory } from "@/enums";
import { InvoiceDetailUpdateRequest } from "@/types";
import { Dispatch } from "react";
import { useTranslation } from "react-i18next";

interface UpdateItemInvoiceDetailProps {
  value: InvoiceDetailUpdateRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<InvoiceDetailUpdateRequest>>;
  errors: Partial<Record<keyof InvoiceDetailUpdateRequest, string>>;
  type: string;
}

const UpdateItemInvoiceDetail = ({
  value,
  handleChange,
  setValue,
  errors,
  type,
}: UpdateItemInvoiceDetailProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      {type === ServiceCategory.DEN_BU && (
        <>
          <InputLabel
            id="serviceName"
            name="serviceName"
            placeholder={t("service.response.name")}
            label={t("service.addOrUpdate.name")}
            value={value.serviceName ?? ""}
            onChange={handleChange}
            errorText={errors.serviceName}
          />
          <InputLabel
            id="quantity"
            name="quantity"
            placeholder="100"
            type="number"
            label={t("invoice.addOrUpdate.quantity")}
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
            label={t("invoice.addOrUpdate.unitPrice")}
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
          label={t("invoice.addOrUpdate.newIndex")}
          value={value.newIndex ?? ""}
          onChange={handleChange}
          errorText={errors.newIndex}
          required
        />
      )}

      <TextareaLabel
        id="description"
        name="description"
        placeholder={t("invoice.addOrUpdate.placeholderDescription")}
        label={t("invoice.addOrUpdate.labelDescription")}
        value={value.description ?? ""}
        onChange={(e) => setValue((prev) => ({ ...prev, description: e.target.value }))}
      />
    </div>
  );
};

export default UpdateItemInvoiceDetail;
