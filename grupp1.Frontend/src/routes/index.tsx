import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { sv } from "date-fns/locale";

import { GetAllAvailableTimes } from "@/api/services/AvailableTimeService";
import AddEditTimeModal from "@/components/addEditTimeModal";
import { ChevronLeft, ChevronRight, Dot, Plus } from "lucide-react";
import type { GetAllAvailableTimesResponse, KindergartenDto } from "@/api/models";
import { addMonths, format } from "date-fns";
import { GetAllKindergartens } from "@/api/services/KindergartenService";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState(new Date());

  function openDialog(day?: Date) {
    setDate(day);
    setOpen(true);
  }

  const AvailableTimeResponse = GetAllAvailableTimes();
  const KindergartenResponse = GetAllKindergartens();

  if (AvailableTimeResponse.isPending || KindergartenResponse.isPending) {
    return <div>Loading...</div>;
  }

  if (AvailableTimeResponse.error || KindergartenResponse.error) {
    return <div>Error!</div>;
  }

  const availableTimeData: GetAllAvailableTimesResponse = AvailableTimeResponse.data;
  const KindergartenData: KindergartenDto[] = KindergartenResponse.data.kindergartens;

  const dateFormattedStartDates: string[] =
    availableTimeData.availableTimes.map((at) =>
      new Date(at.startTime).toDateString(),
    );

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <header className="flex justify-between h-16 shrink-0 items-center gap-4 border-b px-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setMonth(new Date())}>
            Idag
          </Button>

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMonth(addMonths(month, -1))}
            >
              <ChevronLeft />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMonth(addMonths(month, 1))}
            >
              <ChevronRight />
            </Button>
          </div>
          <h1 className="text-2xl font-medium capitalize">
            {format(month, "MMMM yyyy", { locale: sv })}
          </h1>
        </div>

        <Button variant="default" onClick={() => openDialog()}>
          <Plus />
          Ny Tid
        </Button>
      </header>
      <div className="min-h-0 flex-1">
        <Calendar
          formatters={{
            formatWeekdayName: (date) =>
              format(date, "EEE", { locale: sv }).toUpperCase(),
          }}
          locale={sv}
          mode="single"
          month={month}
          onMonthChange={setMonth}
          selected={date}
          onDayClick={openDialog}
          weekStartsOn={1}
          fixedWeeks
          hideNavigation
          captionLayout="label"
          hidden={{ dayOfWeek: [0, 6] }}
          className="h-full w-full p-0"
          classNames={{
            nav: "hidden",
            month_caption: "hidden",
            root: "flex h-full w-full flex-col",
            months: "flex h-full w-full",
            month: "flex h-full w-full flex-col gap-0 pt-0",
            month_grid: "flex min-h-0 w-full flex-1 flex-col",
            weekdays:
              "grid h-10 w-full shrink-0 grid-cols-5 [&>*:nth-child(n+6)]:hidden",
            weekday:
              "flex items-center justify-center border-b text-sm font-medium",
            weeks: "grid min-h-0 flex-1 auto-rows-fr",
            week: "grid min-h-0 grid-cols-5 [&>*:nth-child(n+6)]:hidden",
            day: "h-full min-h-0 min-w-0 w-full rounded-none border-b border-r p-0",
          }}
          components={{
            DayButton: ({ children, modifiers, day, ...props }) => {
              const eventToday = dateFormattedStartDates.filter(
                (d) => d === day.date.toDateString(),
              );

              return (
                <CalendarDayButton
                  day={day}
                  modifiers={modifiers}
                  {...props}
                  className="flex h-full w-full flex-col items-center justify-start gap-2 rounded-none p-2"
                >
                  {children}
                  <div className="flex flex-col gap-1">
                    {eventToday.map((_, index) => (
                      <div
                        className="flex flex-row gap-1 items-center"
                        key={index}
                      >
                        <Dot
                          key={index}
                          className="size-1.5 rounded-full bg-blue-600"
                        />
                        <p>{_}</p>
                      </div>
                    ))}
                  </div>
                </CalendarDayButton>
              );
            },
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
          kindergartens={KindergartenData}
          selectedDate={date}
        />
      </div>
    </div>
  );
}
