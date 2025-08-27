import ButtonFilter from "@/components/ButtonFilter";
import DateRangePicker from "@/components/DateRangePicker";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { PaymentMethod, PaymentStatus } from "@/enums";
import { PaymentReceiptFilter as Filter } from "@/types";
import { parseISO } from "date-fns";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";

export interface PaymentReceiptFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
}

const PaymentReceiptFilter = ({ props }: { props: PaymentReceiptFilterProps }) => {
  const { t } = useTranslation();
  const { fromAmount, fromDate, paymentMethod, paymentStatus, query, toAmount, toDate } =
    props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof Filter, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const dateRange: DateRange | undefined =
    fromDate || toDate
      ? {
          from: fromDate ? parseISO(fromDate) : undefined,
          to: toDate ? parseISO(toDate) : undefined,
        }
      : undefined;

  const handleChangeDate = (range: DateRange | undefined) => {
    setFilterValues((prev) => ({
      ...prev,
      fromDate: range?.from ? range.from.toISOString() : "",
      toDate: range?.to ? range.to.toISOString() : "",
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
  };

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder={t("paymentReceipt.filter.placeholderPaymentMethod")}
          labelSelect={t("paymentReceipt.filter.labelPaymentMethod")}
          data={[
            { label: t("statusBadge.paymentMethod.transfer"), value: PaymentMethod.CHUYEN_KHOAN },
            { label: t("statusBadge.paymentMethod.cash"), value: PaymentMethod.TIEN_MAT },
            { label: t("statusBadge.paymentMethod.momo"), value: PaymentMethod.MOMO },
            { label: t("statusBadge.paymentMethod.vnpay"), value: PaymentMethod.VNPAY },
            { label: t("statusBadge.paymentMethod.zalopay"), value: PaymentMethod.ZALOPAY },
            {
              label: t("statusBadge.paymentMethod.transfer"),
              value: PaymentMethod.CHON_PHUONG_THUC,
            },
          ]}
          value={paymentMethod ?? ""}
          onChange={(value) => handleChange("paymentMethod", String(value))}
          name="paymentMethod"
          showClear
        />
        <FieldsSelectLabel
          placeholder={t("paymentReceipt.filter.placeholderPaymentStatus")}
          labelSelect={t("paymentReceipt.filter.labelPaymentStatus")}
          data={[
            { label: t("statusBadge.paymentStatus.pending"), value: PaymentStatus.CHO_THANH_TOAN },
            { label: t("statusBadge.paymentStatus.confirming"), value: PaymentStatus.CHO_XAC_NHAN },
            { label: t("statusBadge.paymentStatus.paid"), value: PaymentStatus.DA_THANH_TOAN },
            { label: t("statusBadge.paymentStatus.rejected"), value: PaymentStatus.TU_CHOI },
            { label: t("statusBadge.paymentStatus.cancelled"), value: PaymentStatus.HUY },
          ]}
          value={paymentStatus ?? ""}
          onChange={(value) => handleChange("paymentStatus", String(value))}
          name="paymentStatus"
          showClear
        />
        <DateRangePicker value={dateRange} onChange={handleChangeDate} />
      </div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-5 w-full items-end">
        <InputLabel
          type="number"
          id="fromAmount"
          name="fromAmount"
          placeholder={t("paymentReceipt.filter.placeholderFromAmount")}
          value={fromAmount ?? ""}
          onChange={(e) => handleChange("fromAmount", e.target.value)}
        />
        <InputLabel
          type="number"
          id="toAmount"
          name="toAmount"
          placeholder={t("paymentReceipt.filter.placeholderToAmount")}
          value={toAmount ?? ""}
          onChange={(e) => handleChange("toAmount", e.target.value)}
        />
        <InputLabel
          type="text"
          id="query"
          name="query"
          placeholder={t("paymentReceipt.filter.placeholderQuery")}
          value={query ?? ""}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </div>

      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default PaymentReceiptFilter;
