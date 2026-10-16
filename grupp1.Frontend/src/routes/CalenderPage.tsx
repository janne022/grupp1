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

  const availableTimeData : GetAllAvailableTimesResponse = data

  console.log("Available times data:", data);

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="mx-auto max-w-3xl flex flex-col items-center gap-4 ">
      <Button variant="outline" onClick={() => openDialog()}>
        New Time
      </Button>

      <Calendar
        locale={sv}
        mode="single"
        selected={date}
        onDayClick={openDialog}
        disabled={{ dayOfWeek: [0, 6] }}
        className="rounded-lg border [--cell-size:3rem]"
        components={{
          DayButton: ({ children, modifiers, day, ...props }) => {
            const isWeekend = day.date.getDay() === 0 || day.date.getDay() === 6

            const eventToday = availableTimeData.availableTimes.some(d => {
              // This is the lacking logic to get a dynamic rendering of available times...
            })

            return (
              <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                {children}
                <div>
                  {eventToday ? <Dot/> : ""}
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
  );
}
