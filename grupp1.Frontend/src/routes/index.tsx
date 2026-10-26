import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { sv } from "date-fns/locale";

import { GetAllAvailableTimes } from "@/api/services/AvailableTimeService";
import AddEditTimeModal from "@/components/addEditTimeModal";
import { ChevronLeft, ChevronRight, Dot, Plus } from "lucide-react";
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
              return (
                <CalendarDayButton
                  day={day}
                  modifiers={modifiers}
                  {...props}
                  className="flex h-full w-full min-w-0 flex-col items-center justify-start gap-2 rounded-none py-2
                  data-[selected-single=true]:bg-transparent!
                  data-[selected-single=true]:text-foreground!
                  data-[selected-single=true]:ring-2!
                  data-[selected-single=true]:ring-inset!
                  data-[selected-single=true]:ring-primary!"
                >
                  {children}
                  <div className="flex w-full min-w-0 flex-col gap-1">
                    {AvailableTimeResponse.data?.availableTimes.map(
                      (item, index) => {
                        return new Date(item.startTime).toLocaleDateString(
                          "sv-SE",
                        ) == day.isoDate ? (
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="flex w-full min-w-0 flex-row gap-1 items-center hover:cursor-pointer hover:text-white hover:bg-primary p-1"
                            key={index}
                          >
                            <Dot
                              key={index}
                              className="size-1.5 rounded-full bg-blue-600"
                            />
                            <p className="min-w-0 truncate leading-normal">
                              Tillgänglig mellan{" "}
                              {new Date(item.startTime).toLocaleTimeString(
                                "sv-SE",
                                { hour: "2-digit", minute: "2-digit" },
                              )}{" "}
                              och{" "}
                              {new Date(item.endTime).toLocaleTimeString(
                                "sv-SE",
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </p>
                          </span>
                        ) : (
                          ""
                        );
                      },
                    )}
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
          kindergartens={KindergartenResponse.data?.kindergartens ?? []}
          selectedDate={date}
        />
      </div>
    </div>
  );
}
