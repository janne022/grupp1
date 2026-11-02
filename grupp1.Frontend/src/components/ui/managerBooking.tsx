import {
  GeneralBooking,
  type GeneralBookingProps,
} from "./generalBookingModal";
import { Field } from "./field";
import { SubstituteDisplay, filterAvailableTimes } from "./substituteDisplay";
import { useState } from "react";
import type { AvailableTimesByManagerDTO } from "@/api/models";
import ConfirmBookingModal from "../confirm-booking-modal";

export interface BookingSubmitData {
  availableTimes?: AvailableTimesByManagerDTO[];
  date: Date | undefined;
  startTime: string;
  endTime: string;
}

interface BookTimeProps extends Omit<
  GeneralBookingProps,
  "onDelete" | "onSubmit" | "children" | "onStartTimeChange" | "onEndTimeChange"
> {
  availableTimes: AvailableTimesByManagerDTO[];
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
  const [confirmOpen, setConfirmOpen] = useState(false);

  function convertToDate(day: Date, time: string) {
    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date(day);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  const from = convertToDate(selectedDate, start);
  const to = convertToDate(selectedDate, end);

  const placeholderSubstitute = {
    // TODO: Get these from the AvailableTimesDTO
    substituteFirstName: "Relevantis",
    substituteLastName: "Vikariesson",
  };
  const userName = `${placeholderSubstitute.substituteFirstName} ${placeholderSubstitute.substituteLastName}`;

  function ConfirmBooking(data: BookingSubmitData) {
    setConfirmOpen(true); // TODO: add the booking api shit here. not for the mvp tho
  }

  const filtered = filterAvailableTimes(availableTimes, from, to);

  return (
    <>
      <GeneralBooking
        {...rest}
        selectedDate={selectedDate}
        startTime={start}
        endTime={end}
        onStartTimeChange={setStart}
        onEndTimeChange={setEnd}
        onSubmit={() =>
          ConfirmBooking({
            availableTimes: filtered,
            date: selectedDate,
            startTime: start,
            endTime: end,
          })
        }
      >
        <Field>
          <SubstituteDisplay
            FilteredAvailableTime={filtered}
            Loading={Loading}
          />
        </Field>
      </GeneralBooking>
      <ConfirmBookingModal
        open={confirmOpen}
        setOpen={setConfirmOpen}
        onConfirm={() => {
          setConfirmOpen(false); // TODO: The Booking API call. (not for MVP)
        }}
        userName={userName}
        kindergartenName={rest.selectedKindergarten ?? ""}
        date={selectedDate.toLocaleDateString("sv-SE", {
          day: "numeric",
          month: "long",
        })}
        startTime={start}
        endTime={end}
      />
    </>
  );
}
