import DatePickerLabel from "@/components/DatePickerLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { InvoiceUpdateRequest } from "@/types";
import { Dispatch } from "react";
import { useTranslation } from "react-i18next";

interface UpdateInvoiceProps {
  value: InvoiceUpdateRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<InvoiceUpdateRequest>>;
  errors: Partial<Record<keyof InvoiceUpdateRequest, string>>;
}

const UpdateInvoice = ({ value, setValue, errors }: UpdateInvoiceProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-3">
      <DatePickerLabel
        date={value?.paymentDueDate ? new Date(value?.paymentDueDate) : undefined}
        setDate={(d) => setValue((prev) => ({ ...prev, paymentDueDate: d.toISOString() }))}
        label={t("invoice.response.paymentDueDate")}
        errorText={errors?.paymentDueDate}
        required
        fromYear={new Date().getFullYear()}
        toYear={new Date().getFullYear()}
      />

      <TextareaLabel
        id="note"
        name="note"
        placeholder={t("invoice.addOrUpdate.notePlaceholder")}
        label={t("invoice.response.note")}
        value={value.note ?? ""}
        onChange={(e) => setValue((prev) => ({ ...prev, note: e.target.value }))}
        errorText={errors.note}
      />
    </div>
  );
};

export default UpdateInvoice;
