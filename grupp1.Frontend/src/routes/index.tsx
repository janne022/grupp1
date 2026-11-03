import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { sv } from "date-fns/locale";
import {
  DeleteAvailableTime,
  GetAllAvailableTimes,
} from "@/api/services/AvailableTimeService";
import AddEditTimeModal from "@/components/addEditTimeModal";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { addMonths, format, isSameDay } from "date-fns";
import { GetAllKindergartens } from "@/api/services/KindergartenService";

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
import { toast } from "@/components/ui/toast";
import type { GetMyAvailableTimesDTO } from "@/api/models";
import { cn } from "cn";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useCurrentUser } from "@/api/services/MeService";
import ManagerBooking from "@/components/ui/managerBooking";
import { useAvailableTimesByManager } from "@/api/services/AvailableTimeByManagerService";
import { GetAllDecidedTimes } from "@/api/services/DecidedTimeService";
import DecidedTimeEntry from "@/components/decidedTimeEntry";
import AvailableTimeEntry from "@/components/availableTimeEntry";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [openModal, setOpenModal] = React.useState(false);
  const [month, setMonth] = React.useState(new Date());
  const [deleteTime, setDeleteTime] = React.useState(false);
  const [popoverOpenId, setPopoverOpenId] = React.useState<string | null>(null);
  const [availableTimeId, setAvailableTimeId] = React.useState("");
  const [selectedAvailableTime, setSelectedAvailableTime] =
    React.useState<GetMyAvailableTimesDTO | null>(null);

  function openDialog(day?: Date) {
    setDate(day);
    setOpenModal(true);
  }

  // Fetch user and depending on role we choose what data to load
  const user = useCurrentUser();

  const isManager = user.data?.roles.includes("Manager") ?? false;
  const isSubstitute = user.data?.roles.includes("Substitute") ?? false;

  // Substitute functions
  const AvailableTimeResponse = GetAllAvailableTimes(isSubstitute);
  const KindergartenResponse = GetAllKindergartens(isSubstitute);
  const DeleteAvailableTimeFunction = DeleteAvailableTime();

  // Manager functions
  const AvailableTimesByManagerResponse = useAvailableTimesByManager(isManager);
  const DecidedTimesResponse = GetAllDecidedTimes(undefined, isManager);

  if (
    AvailableTimeResponse.error ||
    KindergartenResponse.error ||
    user.error ||
    AvailableTimesByManagerResponse.error ||
    DecidedTimesResponse.error
  ) {
    return <div>Error!</div>;
  }

  const userRoles = user.data?.roles ?? [];

  const calendarEvents = isManager
    ? (DecidedTimesResponse.data?.decidedTimes ?? []).map((item) => ({
        id: item.timeId,
        startTime: item.startTime,
        endTime: item.endTime,
        type: "decided" as const,
        original: item,
      }))
    : (AvailableTimeResponse.data?.availableTimes ?? []).map((item) => ({
        id: item.id,
        startTime: item.startTime,
        endTime: item.endTime,
        type: "available" as const,
        original: item,
      }));

  const isCalendarLoading =
    user.isPending || isManager
      ? DecidedTimesResponse.isPending
      : AvailableTimeResponse.isPending;

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

        {userRoles.includes("Substitute") && (
          <Button
            variant="default"
            onClick={() => {
              setSelectedAvailableTime(null);
              openDialog();
            }}
          >
            <Plus />
            Ny Tid
          </Button>
        )}
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
          onSelect={setDate}
          onDayClick={(date) => {
            setSelectedAvailableTime(null);
            openDialog(date);
          }}
          weekStartsOn={1}
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
            Day: ({ day, modifiers, children, className, ...props }) => {
              const isSelected = date ? isSameDay(date, day.date) : false;

              return (
                <ContextMenu>
                  <ContextMenuTrigger
                    render={
                      <td
                        {...props}
                        className={cn(
                          className,
                          "relative cursor-pointer hover:bg-primary/5",
                        )}
                        onClick={(e) => {
                          if (modifiers.disabled || modifiers.hidden) return;

                          if (
                            (e.target as HTMLElement).closest(
                              "button, a, input, select, textarea, [role='button']",
                            )
                          ) {
                            return;
                          }

                          setSelectedAvailableTime(null);
                          openDialog(day.date);
                        }}
                      >
                        {children}

                        {isSelected && (
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 z-20 border-2 border-primary"
                          />
                        )}
                      </td>
                    }
                  />

                  <ContextMenuContent>
                    <ContextMenuGroup>
                      <ContextMenuItem
                        onClick={() => {
                          setSelectedAvailableTime(null);
                          openDialog(day.date);
                        }}
                      >
                        <PlusIcon />
                        Ny Tid
                      </ContextMenuItem>
                    </ContextMenuGroup>
                  </ContextMenuContent>
                </ContextMenu>
              );
            },
            DayButton: ({ children, modifiers, day, ...props }) => {
              const isSelected = date ? isSameDay(date, day.date) : false;

              return (
                <div className="flex h-full min-h-0 min-w-0 flex-col gap-1 p-2">
                  {isCalendarLoading ? (
                    <Skeleton className="h-8 min-h-8 w-full shrink-0 rounded-md" />
                  ) : (
                    <CalendarDayButton
                      day={day}
                      modifiers={modifiers}
                      {...props}
                      data-selected-single={isSelected}
                      className="h-8! min-h-8! w-8! shrink-0 self-end rounded-md p-0 data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground"
                    >
                      {children}
                    </CalendarDayButton>
                  )}
                  <div className="flex flex-1 min-h-0 w-full min-w-0 flex-col gap-1 overflow-y-auto">
                    {calendarEvents
                      .filter((item) => {
                        const start = new Date(
                          item.startTime,
                        ).toLocaleDateString("sv-SE");
                        const end = new Date(item.endTime).toLocaleDateString(
                          "sv-SE",
                        );

                        return start <= day.isoDate && end >= day.isoDate;
                      })
                      .map((item) => {
                        const uniqueKey = `${item.type}-${item.id}-${day.isoDate}`;

                        const onOpenChange = (open: boolean) => {
                          setPopoverOpenId((current) =>
                            open
                              ? uniqueKey
                              : current === uniqueKey
                                ? null
                                : current,
                          );
                        };

                        return item.type === "decided" ? (
                          <DecidedTimeEntry
                            key={uniqueKey}
                            time={item.original}
                            open={popoverOpenId === uniqueKey}
                            onOpenChange={onOpenChange}
                          />
                        ) : (
                          <AvailableTimeEntry
                            key={uniqueKey}
                            time={item.original}
                            open={popoverOpenId === uniqueKey}
                            onOpenChange={onOpenChange}
                            onEdit={(time) => {
                              setSelectedAvailableTime(time);
                              setOpenModal(true);
                            }}
                            onDelete={(id) => {
                              setAvailableTimeId(id);
                              setDeleteTime(true);
                            }}
                          />
                        );
                      })}
                  </div>
                </div>
              );
            },
          }}
        />

        {userRoles.includes("Manager") && (
          <ManagerBooking
            open={openModal}
            setOpen={setOpenModal}
            title="Boka tid"
            availableTimes={
              AvailableTimesByManagerResponse.data
                ?.availableTimesByKindergarten ?? []
            }
            submitLabel="Bekräfta Bokning"
            selectedDate={date}
            showOnlyTime={true}
          />
        )}

        {userRoles.includes("Substitute") && (
          <AddEditTimeModal
            open={openModal}
            setOpen={setOpenModal}
            updateAvailableTime={selectedAvailableTime}
            allKindergartens={KindergartenResponse.data?.kindergartens ?? []}
            selectedDate={date}
          />
        )}

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
              <AlertDialogAction
                onClick={(e) => {
                  e.stopPropagation();

                  DeleteAvailableTimeFunction.mutate(availableTimeId, {
                    onSuccess: () => {
                      toast.add({
                        type: "success",
                        title: "Success!",
                        description: "Din tillgängliga tid har tagits bort", // TODO: iterate here, to show more dynamic information about what was deleted
                      });
                    },

                    onError: () => {
                      toast.add({
                        type: "error",
                        title: "Åh nej...",
                        description:
                          "Något gick fel när tiden skulle tas bort.",
                      });
                    },
                  });

                  setAvailableTimeId("");
                  setDeleteTime(false);
                }}
                variant="destructive"
              >
                Radera
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
