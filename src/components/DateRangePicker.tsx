import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

import { cn, localeMap } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useViewport from "@/hooks/useViewport";

type DateRangePickerProps = {
  className?: string;
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
  fromYear?: number;
  toYear?: number;
};

export function DateRangePicker({ className, value, onChange, fromYear, toYear }: DateRangePickerProps) {
  const { width } = useViewport();
  const { i18n, t } = useTranslation();
  const currentLocale = localeMap[i18n.language] ?? enUS;

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("justify-start text-left font-normal !bg-transparent", !value && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "dd/MM/yyyy", { locale: currentLocale })} -{" "}
                  {format(value.to, "dd/MM/yyyy", { locale: currentLocale })}
                </>
              ) : (
                format(value.from, "dd/MM/yyyy", { locale: currentLocale })
              )
            ) : (
              <span>{t("common.selectDateRange")}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0"
          align="end"
          side="bottom"
          sideOffset={width <= 640 ? -300 : 4}
          alignOffset={width <= 640 ? -20 : 0}
        >
          <Calendar
            captionLayout="dropdown"
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            fromYear={fromYear}
            toYear={toYear}
            locale={currentLocale}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
