import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import RenderIf from "./RenderIf";

interface DateValue {
  date: Date;
  setDate: (date: Date) => void;
  label: string;
  errorText?: string;
}

const DatePickerLabel = ({ date, setDate, label, errorText }: DateValue) => {
  return (
    <div className="flex flex-col">
      <span className="mb-1 text-label text-sm flex gap-1">{label}</span>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "w-full focus:border-primary bg-transparent hover:bg-transparent shadow-sm justify-start text-left font-normal border border-input",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="text-foreground" />
            <span className="text-foreground">{date ? format(date, "dd/MM/yyyy") : "Chọn ngày"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(value) => {
              if (value) setDate(value);
            }}
            captionLayout="dropdown"
          />
        </PopoverContent>
      </Popover>
      <RenderIf value={!!errorText}>
        <span className="text-[12px] text-red-500 font-light">{errorText}</span>
      </RenderIf>
    </div>
  );
};

export default DatePickerLabel;
