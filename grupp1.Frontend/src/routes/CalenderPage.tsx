import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { sv } from "date-fns/locale";

import { GetAllAvailableTimes } from "@/api/services/AvailableTimeService";
import AddEditTimeModal from "@/components/addEditTimeModal";
import { Dot } from "lucide-react";

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
            const isWeekend =
                day.date.getDay() === 0 || day.date.getDay() === 6

            return (
              <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                {children}
                <span>{isWeekend ? "" : <Dot/>}</span>
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
