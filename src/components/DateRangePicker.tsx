import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useState } from "react";

import { cn, localeMap } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import RenderIf from "@/components/RenderIf";
import useViewport from "@/hooks/useViewport";

interface DateRangePickerLabelProps {
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
  label?: string;
  required?: boolean;
  errorText?: string;
  fromYear?: number;
  toYear?: number;
  className?: string;
}

const DateRangePicker = ({
  value,
  onChange,
  label,
  required,
  errorText,
  fromYear,
  toYear,
  className,
}: DateRangePickerLabelProps) => {
  const [touched, setTouched] = useState(false);
  const { width } = useViewport();
  const { i18n, t } = useTranslation();
  const currentLocale = localeMap[i18n.language] ?? enUS;

  const isEmpty = (!value?.from || !value?.to) && required && touched;

  return (
    <div className={cn("flex flex-col", className)}>
      <span className="mb-1 text-label text-sm flex gap-1 font-medium items-center">
        {label}
        {required && <span className="text-[10px] text-red-500">(*)</span>}
      </span>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "justify-start text-left font-normal !bg-transparent border border-input shadow-sm",
              !value && "text-muted-foreground"
            )}
            onBlur={() => setTouched(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-foreground" />
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

      <RenderIf value={!!isEmpty && !!required}>
        <span className="text-[12px] text-red-500 font-light text-left block">Thông tin bắt buộc</span>
      </RenderIf>
      <RenderIf value={!!errorText}>
        <span className="text-[12px] text-red-500 font-light">{errorText}</span>
      </RenderIf>
    </div>
  );
};
export default DateRangePicker;
