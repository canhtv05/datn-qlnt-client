import ButtonFilter from "@/components/ButtonFilter";
import { DateRangePicker } from "@/components/DateRangePicker";
import FieldsSelectLabel from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import RenderIf from "@/components/RenderIf";
import Tooltip from "@/components/ToolTip";
import { Button } from "@/components/ui/button";
import { NotificationType } from "@/enums";
import { NotificationFilter } from "@/types";
import { parseISO } from "date-fns";
import { Eye, EyeOff } from "lucide-react";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";

export interface NotificationFilterProps {
  filterValues: NotificationFilter;
  setFilterValues: Dispatch<SetStateAction<NotificationFilter>>;
  onClear: () => void;
  onFilter: () => void;
}

const DashBoardFilter = ({ props }: { props: NotificationFilterProps }) => {
  const { fromDate, notificationType, query, toDate } = props.filterValues;
  const setFilterValues = props.setFilterValues;

  const { t } = useTranslation();

  const [isVisible, setIsVisible] = useState<boolean>(true);

  const handleChange = (key: keyof NotificationFilter, value: string) => {
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
    <form
      className="bg-background p-5 flex flex-col gap-3 rounded-sm mt-[2px] items-stretch w-full"
      onSubmit={handleSubmit}
    >
      <RenderIf value={isVisible}>
        <FieldsSelectLabel
          placeholder={t("notificationFilter.typePlaceholder")}
          labelSelect={t("notificationFilter.typeLabel")}
          data={[
            { label: t("notificationFilter.type.general"), value: NotificationType.CHUNG },
            { label: t("notificationFilter.type.system"), value: NotificationType.HE_THONG },
            { label: t("notificationFilter.type.other"), value: NotificationType.KHAC },
          ]}
          value={notificationType ?? undefined}
          onChange={(value) => handleChange("notificationType", String(value))}
          name="notificationType"
          showClear
        />
        <DateRangePicker value={dateRange} onChange={handleChangeDate} />
        <InputLabel
          id="query"
          name="query"
          placeholder={t("notificationFilter.search")}
          value={query ?? undefined}
          onChange={(e) => handleChange("query", e.target.value)}
        />
      </RenderIf>
      <div className={`flex items-center w-full ${isVisible ? "justify-between" : "justify-center"}`}>
        <Tooltip content={isVisible ? t("notificationFilter.hide") : t("notificationFilter.show")}>
          <Button
            size={"icon"}
            variant={"ghost"}
            type="button"
            className="bg-secondary cursor-pointer"
            onClick={() => setIsVisible((prev) => !prev)}
          >
            {!isVisible ? <Eye /> : <EyeOff />}
          </Button>
        </Tooltip>
        <RenderIf value={isVisible}>
          <ButtonFilter onClear={props.onClear} />
        </RenderIf>
      </div>
    </form>
  );
};

export default DashBoardFilter;
