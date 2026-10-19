import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { sv } from "date-fns/locale";

import { GetAllAvailableTimes } from "@/api/services/AvailableTimeService";
import AddEditTimeModal from "@/components/addEditTimeModal";
import { Dot } from "lucide-react";
import type { GetAllAvailableTimesResponse } from "@/api/models";

export const Route = createFileRoute("/CalenderPage")({
  component: RouteComponent,
});

function RouteComponent() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [open, setOpen] = React.useState(false);

  function openDialog(day?: Date) {
    setDate(day);
    setOpen(true);
  }

  const { isPending, data, error } = GetAllAvailableTimes();

  const availableTimeData: GetAllAvailableTimesResponse = data

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const dateFormattedStartDates: string[] = availableTimeData.availableTimes.map(at => new Date(at.startTime).toDateString())

  return (
    <div className="border-4 w-full h-screen border-amber-900">
      <Calendar
        locale={sv}
        mode="single"
        selected={date}
        onDayClick={openDialog}
        disabled={{ dayOfWeek: [0, 6] }}
        className="rounded-lg border [--cell-size:6rem] w-300 h-fit [&_.rdp-weekday:nth-child(n+6)]:hidden
    [&_.rdp-week>.rdp-day:nth-child(n+6)]:hidden     [&_.rdp-day]:!w-24
    [&_.rdp-day_button]:!w-full
[&_.rdp-weekday]:!w-24"
        components={{
          DayButton: ({ children, modifiers, day, ...props }) => {

            let eventToday = dateFormattedStartDates.filter(d => d === day.date.toDateString())

            return (
              <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                {children}
                <div className="flex">
                  {eventToday.map(() => {
                    return <Dot />
                  })}
                </div>
              </CalendarDayButton>
            )
          }
        }}
      />
      <AddEditTimeModal
        open={open}
        setOpen={setOpen}
        deleteItem={function (): void {
          throw new Error("Function not implemented.");
        }}
        addTime={function (): void {
          throw new Error("Function not implemented.");
        }}
        kindergartens={[]}
        selectedDate={date}
      />
    </div>
      // <Button variant="outline" onClick={() => openDialog()}>
      //   New Time
      // </Button>
  );
}
