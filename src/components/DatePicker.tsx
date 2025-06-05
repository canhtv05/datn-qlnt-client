import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date>(new Date("2000-01-01"));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"none"}
          className={cn(
            "w-full border focus:border-primary shadow-sm justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="text-foreground" />
          <span className="text-foreground">{date ? format(date, "yyyy/MM/dd") : "Chọn ngày sinh"}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
