import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useAppSelector } from "@app/store";
import { cn } from "@shared/lib/utils";
import { Button } from "@shared/ui/button";
import { Calendar } from "@shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@shared/ui/popover";

interface DatePickerProps {
  value?: string; // ISO date string "YYYY-MM-DD"
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  fromYear?: number;
  toYear?: number;
}

export function DatePicker({
  value,
  onChange,
  placeholder,
  className,
  disabled,
  fromYear = 1920,
  toYear = new Date().getFullYear(),
}: DatePickerProps) {
  const language = useAppSelector((state) => state.language.current);
  const isRtl = language === "ar";
  const locale = isRtl ? ar : enUS;

  // Parse ISO string to Date
  const selected = value ? new Date(value + "T00:00:00") : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    // Format back to ISO string "YYYY-MM-DD"
    const iso = format(date, "yyyy-MM-dd");
    onChange?.(iso);
  };

  const displayValue = selected ? format(selected, "PPP", { locale }) : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-start font-normal",
            !selected && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="me-2 h-4 w-4 shrink-0" />
          {displayValue ?? <span>{placeholder ?? "Pick a date"}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={handleSelect}
          captionLayout="dropdown"
          fromYear={fromYear}
          toYear={toYear}
          locale={locale}
          dir={isRtl ? "rtl" : "ltr"}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
