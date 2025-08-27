import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { InvoiceStatus, InvoiceType } from "@/enums";
import { InvoiceFilter as Filter } from "@/types";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

export interface InvoiceFilterForUserProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
}

const InvoiceFilterForUser = ({ props }: { props: InvoiceFilterForUserProps }) => {
  const { t } = useTranslation();
  const { invoiceStatus, invoiceType, maxTotalAmount, minTotalAmount, month, query, year } =
    props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof Filter, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-4 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder={t("invoice.filter.placeholderStatus")}
          labelSelect={t("invoice.response.invoiceStatus")}
          data={[
            {
              label: t("statusBadge.invoiceStatus.unpaid"),
              value: InvoiceStatus.CHUA_THANH_TOAN,
            },
            { label: t("statusBadge.invoiceStatus.paid"), value: InvoiceStatus.DA_THANH_TOAN },
            { label: t("statusBadge.invoiceStatus.restored"), value: InvoiceStatus.KHOI_PHUC },
            { label: t("statusBadge.invoiceStatus.overdue"), value: InvoiceStatus.QUA_HAN },
          ]}
          value={invoiceStatus ?? ""}
          onChange={(value) => handleChange("invoiceStatus", String(value))}
          name="invoiceStatus"
          showClear
        />

        <FieldsSelectLabel
          placeholder={t("invoice.filter.placeholderStatus")}
          labelSelect={t("invoice.response.invoiceType")}
          data={[
            { label: t("statusBadge.invoiceType.monthly"), value: InvoiceType.HANG_THANG },
            { label: t("statusBadge.invoiceType.final"), value: InvoiceType.CUOI_CUNG },
          ]}
          value={invoiceType ?? ""}
          onChange={(value) => handleChange("invoiceType", String(value))}
          name="invoiceType"
          showClear
        />
        <InputLabel
          type="number"
          id="month"
          name="month"
          placeholder={t("invoice.filter.placeholderMonth")}
          min={1}
          max={12}
          step={1}
          value={month ?? undefined}
          onChange={(e) => handleChange("month", e.target.value)}
        />
        <InputLabel
          type="number"
          id="year"
          name="year"
          placeholder={t("invoice.filter.placeholderYear")}
          value={year ?? undefined}
          onChange={(e) => handleChange("year", e.target.value)}
        />
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end">
        <InputLabel
          type="number"
          id="minTotalAmount"
          name="minTotalAmount"
          placeholder={t("invoice.filter.placeholderMinTotalAmount")}
          value={minTotalAmount}
          onChange={(e) => handleChange("minTotalAmount", e.target.value)}
        />
        <InputLabel
          type="number"
          id="maxTotalAmount"
          name="maxTotalAmount"
          placeholder={t("invoice.filter.placeholderMaxTotalAmount")}
          value={maxTotalAmount}
          onChange={(e) => handleChange("maxTotalAmount", e.target.value)}
        />
        <InputLabel
          type="text"
          id="query"
          name="query"
          placeholder={t("invoice.filter.placeholderQuery")}
          value={query}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>

      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default InvoiceFilterForUser;
