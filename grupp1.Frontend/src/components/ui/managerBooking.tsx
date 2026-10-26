import type { AvailableTimeInfo } from "@/routes/TestPage";
import {
  GeneralBooking,
  type GeneralBookingProps,
} from "./generalBookingModal";
import { Field } from "./field";
import {
  SubstituteDisplay,
  filterAvailableTimes,
} from "./substituteDisplay";
import { useState } from "react";

export interface BookingSubmitData {
  substitutes?: AvailableTimeInfo[];
  date: Date | undefined;
  startTime: string;
  endTime: string;
}

interface BookTimeProps extends Omit<
  GeneralBookingProps,
  "onDelete" | "onSubmit" | "children" | "onStartTimeChange" | "onEndTimeChange"
> {
  availableTimes: AvailableTimeInfo[];
  Loading: boolean;
}

export default function ManagerBooking({
  availableTimes,
  startTime,
  endTime,
  Loading,
  selectedDate,
  ...rest
}: BookTimeProps) {
  const [start, setStart] = useState(startTime ?? "08:00");
  const [end, setEnd] = useState(endTime ?? "16:00");

  function convertToDate(day: Date, time: string) {
    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date(day);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  const from = convertToDate(selectedDate, start);
  const to = convertToDate(selectedDate, end);
  
  function ConfirmBooking(data: BookingSubmitData) {
    console.log(data); // TODO: add the booking api shit here. not for the mvp tho
  }

  const filtered = filterAvailableTimes(availableTimes, from, to);
  

  return (
    <GeneralBooking
      {...rest}
      selectedDate={selectedDate}
      startTime={start}
      endTime={end}
      onStartTimeChange={setStart}
      onEndTimeChange={setEnd}
      onSubmit={() =>
        ConfirmBooking({
          substitutes: filtered,
          date: selectedDate,
          startTime: start,
          endTime: end,
        })
      }
    >
      <Field>
        <SubstituteDisplay FilteredAvailableTime={filtered} Loading={Loading} />
      </Field>
    </GeneralBooking>
  );
}
