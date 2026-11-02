import { useState } from "react";
import {
  GeneralBooking,
  type GeneralBookingProps,
} from "./generalBookingModal";
import { filterAvailableTimes } from "./substituteDisplay";
import type { AvailableTimesByKindergartenDTO } from "@/api/models";
import { Clock, Phone } from "lucide-react";

export interface BookingSubmitData {
  availableTimes: AvailableTimesByKindergartenDTO[];
  date: Date | undefined;
  startTime: string;
  endTime: string;
}

interface BookTimeProps extends Omit<
  GeneralBookingProps,
  "onDelete" | "onSubmit" | "children" | "onStartTimeChange" | "onEndTimeChange"
> {
  availableTimes?: AvailableTimesByKindergartenDTO[];
}

function convertToDate(day: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(day);
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function formatTime(value: string): string {
  if (/^\d{2}:\d{2}/.test(value)) {
    return value.slice(0, 5);
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      });
}

export default function ManagerBooking({
  availableTimes = [],
  startTime,
  endTime,
  selectedDate,
  ...rest
}: BookTimeProps) {
  const [start, setStart] = useState(startTime ?? "08:00");
  const [end, setEnd] = useState(endTime ?? "16:00");

  const from = selectedDate ? convertToDate(selectedDate, start) : undefined;

  const to = selectedDate ? convertToDate(selectedDate, end) : undefined;

  // Filter each kindergarten's available times separately
  const filtered: AvailableTimesByKindergartenDTO[] =
    from && to && from < to
      ? availableTimes
          .map((kindergarten) => ({
            ...kindergarten,
            availableTimes: filterAvailableTimes(
              kindergarten.availableTimes,
              from,
              to,
            ),
          }))
          .filter((kindergarten) => kindergarten.availableTimes.length > 0)
      : [];

  function ConfirmBooking(data: BookingSubmitData) {
    console.log(data);
    // TODO: Implement booking API
  }

  return (
    <GeneralBooking
      {...rest}
      selectedDate={selectedDate}
      selectedKindergarten="Alla förskolor"
      startTime={start}
      endTime={end}
      onStartTimeChange={setStart}
      onEndTimeChange={setEnd}
      submitDisabled={!from || !to || from >= to || filtered.length === 0}
      onSubmit={() =>
        ConfirmBooking({
          availableTimes: filtered,
          date: selectedDate,
          startTime: start,
          endTime: end,
        })
      }
    >
      <div className="max-h-72 space-y-4 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Inga tillgängliga vikarier för den valda tiden.
          </p>
        ) : (
          filtered.map((kindergarten) => (
            <section
              key={kindergarten.kindergartenId}
              className="space-y-2 rounded-lg border p-3"
            >
              <h3 className="font-semibold">{kindergarten.kindergartenName}</h3>

              <div className="space-y-2">
                {kindergarten.availableTimes.map((time) => (
                  <div
                    key={time.id}
                    className="flex flex-col gap-1.5 rounded-md bg-muted p-3"
                  >
                    <p className="text-sm font-medium underline">
                      {time.substitute.firstName} {time.substitute.lastName}
                    </p>

                    <p className="flex flex-row gap-1 text-xs text-muted-foreground">
                      <Phone size={16} /> {time.substitute.phoneNumber}
                    </p>

                    <p className="flex flex-row gap-1 text-xs text-muted-foreground">
                      <Clock size={16} /> {formatTime(time.startTime)} –{" "}
                      {formatTime(time.endTime)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </GeneralBooking>
  );
}
