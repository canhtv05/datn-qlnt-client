import ButtonFilter from "@/components/ButtonFilter";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import { NotificationType } from "@/enums";
import { NotificationFilter as Filter } from "@/types";
import { parseISO } from "date-fns";
import { Dispatch, FormEvent, SetStateAction } from "react";
import { DateRange } from "react-day-picker";
import DateRangePicker from "../DateRangePicker";

export interface NotificationFilterProps {
  filterValues: Filter;
  setFilterValues: Dispatch<SetStateAction<Filter>>;
  onClear: () => void;
  onFilter: () => void;
}

const NotificationFilter = ({ props }: { props: NotificationFilterProps }) => {
  const { fromDate, notificationType, query, toDate } = props.filterValues;
  const setFilterValues = props.setFilterValues;

  const handleChange = (key: keyof Filter, value: string) => {
    setFilterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onFilter();
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

  return (
    <form className="bg-background p-5 flex flex-col gap-2 items-end" onSubmit={handleSubmit}>
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full items-end">
        <FieldsSelectLabel
          placeholder="-- Loại thông báo --"
          labelSelect="Loại thông báo"
          data={[
            { label: "Chung", value: NotificationType.CHUNG },
            { label: "Hệ thống", value: NotificationType.HE_THONG },
            { label: "Khác", value: NotificationType.KHAC },
          ]}
          value={notificationType ?? undefined}
          onChange={(value) => handleChange("notificationType", String(value))}
          name="notificationType"
          showClear
        />
        <DateRangePicker value={dateRange} onChange={handleChangeDate} />
      </div>
      <InputLabel
        id="query"
        name="query"
        placeholder="Tìm kiếm"
        value={query ?? undefined}
        onChange={(e) => handleChange("query", e.target.value)}
      />
      <ButtonFilter onClear={props.onClear} />
    </form>
  );
};

export default NotificationFilter;
