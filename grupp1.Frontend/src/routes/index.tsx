import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { sv } from "date-fns/locale";

import { GetAllAvailableTimes } from "@/api/services/AvailableTimeService";
import AddEditTimeModal from "@/components/addEditTimeModal";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Dot,
  PenLine,
  Plus,
  Trash,
  Trash2Icon,
  X,
} from "lucide-react";
import { addMonths, format } from "date-fns";
import { GetAllKindergartens } from "@/api/services/KindergartenService";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [open, setOpen] = React.useState(false);
  const [month, setMonth] = React.useState(new Date());
  const [deleteTime, setDeleteTime] = React.useState(false);
  const [popoverOpen, setPopoverOpen] = React.useState(false);

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
                    {AvailableTimeResponse.data?.availableTimes
                      .filter(
                        (item) =>
                          new Date(item.startTime).toLocaleDateString(
                            "sv-SE",
                          ) === day.isoDate,
                      )
                      .map((item, index) => (
                        <Popover
                          key={index}
                          open={popoverOpen}
                          onOpenChange={setPopoverOpen}
                        >
                          <PopoverTrigger
                            render={
                              <button
                                type="button"
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
                                <span className="min-w-0 truncate leading-normal">
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
                                </span>
                              </button>
                            }
                          />
                          <PopoverContent
                            className="w-80 p-4 shadow-2xl border rounded-lg bg-popover text-popover-foreground"
                            side="right"
                            align="center"
                          >
                            <div className="grid gap-4">
                              <div className="space-y-5">
                                <div className="flex flex-row justify-between items-center">
                                  <h3 className="leading-none font-medium text-lg">
                                    <Clock className="size-4 mr-2 inline-block" />
                                    Tillgänglig Tid
                                  </h3>
                                  <div className="flex flex-row">
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpen(true);
                                      }}
                                      variant="ghost"
                                      size="icon-sm"
                                    >
                                      <PenLine className="text-primary/70" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon-sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteTime(true);
                                      }}
                                      className="hover:bg-destructive/10"
                                    >
                                      <Trash className="text-destructive" />
                                    </Button>
                                    <div className="mx-1 h-5 w-px bg-gray-400 translate-y-1" />
                                    <Button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setPopoverOpen(false);
                                      }}
                                      variant="ghost"
                                      size="icon-sm"
                                    >
                                      <X />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                  <p className="text-sm">
                                    {new Date(
                                      item.startTime,
                                    ).toLocaleDateString("sv-SE", {
                                      weekday: "long",
                                    })}
                                    {" den "}
                                    {new Date(
                                      item.startTime,
                                    ).toLocaleDateString("sv-SE", {
                                      day: "numeric",
                                      month: "long",
                                    })}
                                    {" ⋅ "}
                                    {new Date(
                                      item.startTime,
                                    ).toLocaleTimeString("sv-SE", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}{" "}
                                    -{" "}
                                    {new Date(item.endTime).toLocaleTimeString(
                                      "sv-SE",
                                      { hour: "2-digit", minute: "2-digit" },
                                    )}
                                  </p>
                                  <div>
                                    <p className="text-sm">Förskolor</p>
                                    <p className="text-sm text-muted-foreground">
                                      {item.kindergartens
                                        .map(
                                          (kindergarten) => kindergarten.name,
                                        )
                                        .join(", ")}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
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
          kindergartens={KindergartenResponse.data?.kindergartens ?? []}
          selectedDate={date}
        />

        <AlertDialog open={deleteTime} onOpenChange={setDeleteTime}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                <Trash2Icon />
              </AlertDialogMedia>
              <AlertDialogTitle>Radera Tillgänlig tid?</AlertDialogTitle>
              <AlertDialogDescription>
                Det här kommer att radera den tillgängliga tiden. Detta går inte
                att ångra.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Avbryt</AlertDialogCancel>
              <AlertDialogAction variant="destructive">
                Radera
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
