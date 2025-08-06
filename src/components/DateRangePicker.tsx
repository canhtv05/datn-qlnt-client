import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { vi } from "date-fns/locale";

import { cn } from "@/lib/utils";
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

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("justify-start text-left font-normal", !value && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "dd/MM/yyyy")} - {format(value.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(value.from, "dd/MM/yyyy")
              )
            ) : (
              <span>Chọn khoảng thời gian</span>
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
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            fromYear={fromYear}
            toYear={toYear}
            locale={vi}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
