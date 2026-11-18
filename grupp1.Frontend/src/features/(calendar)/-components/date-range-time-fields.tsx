import { useState } from "react";
import { sv } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/shared/components/ui/calendar";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldTitle,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";

export type DateTimeValue = {
  date: Date;
  time: string;
};

export type DateTimeRange = {
  start: DateTimeValue;
  end: DateTimeValue;
};

type FieldErrorMessage = { message?: string } | undefined;

interface DateRangeTimeFieldsProps {
  value: DateTimeRange;
  onChange: (next: DateTimeRange) => void;
  startError?: FieldErrorMessage;
  endError?: FieldErrorMessage;
  className?: string;
}

export function DateRangeTimeFields({
  value,
  onChange,
  startError,
  endError,
  className,
}: DateRangeTimeFieldsProps) {
  const [pendingStart, setPendingStart] = useState<Date | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => value.start.date);

  const selectedRange: DateRange = pendingStart
    ? { from: pendingStart, to: undefined }
    : { from: value.start.date, to: value.end.date };

  function handleRangeSelect(_range: DateRange | undefined, clickedDate: Date) {
    if (pendingStart && clickedDate >= pendingStart) {
      setPendingStart(null);
      onChange({
        start: { ...value.start, date: pendingStart },
        end: { ...value.end, date: clickedDate },
      });
      return;
    }

    setPendingStart(clickedDate);
    onChange({
      start: { ...value.start, date: clickedDate },
      end: { ...value.end, date: clickedDate },
    });
  }

  return (
    <FieldGroup className={className}>
      <Field data-invalid={!!startError}>
        <Calendar
          mode="range"
          disabled={[
            { before: new Date(new Date().setHours(0, 0, 0, 0)) },
            { dayOfWeek: [0, 6] },
          ]}
          locale={sv}
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          weekStartsOn={1}
          className="w-full p-0"
          classNames={{
            root: "relative w-full",
            month: "flex w-full flex-col gap-1",
            nav: "absolute top-0 left-1/2 z-10 flex h-7 w-56 -translate-x-1/2 items-center justify-between",
            month_caption: "flex h-7 items-center justify-center",
            caption_label: "text-sm font-medium",
            weekdays: "grid w-full grid-cols-5",
            week: "mt-1 grid w-full grid-cols-5",
            day: "group/day relative h-[clamp(1.75rem,5dvh,2.5rem)] min-w-0 rounded-md p-0 text-center nth-[n+6]:hidden",
          }}
          selected={selectedRange}
          onSelect={handleRangeSelect}
        />
      </Field>

      <FieldTitle className="font-semibold">Välj tidsintervall</FieldTitle>

      <div className="flex flex-row items-center gap-2">
        <Field data-invalid={!!startError}>
          <Input
            min="06:00"
            max="18:00"
            type="time"
            step="60"
            value={value.start.time}
            onChange={(event) =>
              onChange({
                ...value,
                start: { ...value.start, time: event.target.value },
              })
            }
            aria-invalid={!!startError}
          />
        </Field>

        <p className="flex items-center">till</p>

        <Field data-invalid={!!endError}>
          <Input
            min="06:00"
            max="18:00"
            type="time"
            step="60"
            value={value.end.time}
            onChange={(event) =>
              onChange({
                ...value,
                end: { ...value.end, time: event.target.value },
              })
            }
            aria-invalid={!!endError}
          />
        </Field>
      </div>

      {startError?.message && <FieldError errors={[startError]} />}
      {endError?.message && <FieldError errors={[endError]} />}
    </FieldGroup>
  );
}
