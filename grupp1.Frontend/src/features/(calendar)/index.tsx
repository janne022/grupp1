import { Calendar, CalendarDayButton } from "@/shared/components/ui/calendar";
import { Button } from "@/shared/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";
import { sv } from "date-fns/locale";
import {
  DeleteAvailableTime,
  GetAllAvailableTimes,
} from "@/features/(calendar)/-api/AvailableTimeService";
import AddEditTimeModal from "@/features/(calendar)/-components/substitute-booking-modal";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import {
  addMonths,
  endOfDay,
  format,
  isSameDay,
  isWithinInterval,
  startOfDay,
} from "date-fns";
import {
  GetAllKindergartens,
  GetAllManagerKindergartens,
} from "@/features/(calendar)/-api/KindergartenService";
import { toast } from "@/shared/components/ui/toast";
import type {
  GetAllDecidedTimesDTO,
  GetMyAvailableTimesDTO,
  PendingTimeDto,
} from "@/shared/api/models";
import { cn } from "cn";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/shared/components/ui/context-menu";
import { useCurrentUser } from "@/shared/services/MeService";
import ManagerBooking from "@/features/(calendar)/-components/manager-booking-modal";
import { useAvailableTimesByManager } from "@/features/(calendar)/-api/AvailableTimeByManagerService";
import {
  DeleteDecidedTime,
  GetAllDecidedTimes,
} from "@/features/(calendar)/-api/DecidedTimeService";
import TimeEntry from "@/features/(calendar)/-components/time-entry";
import ConfirmDialog from "@/shared/components/ui/confirm-dialog";
import { GetAllPendingTimes } from "@/shared/services/PendingTimeService";
import { DeletePendingTime } from "@/features/(calendar)/-api/PendingTimeService";

export const Route = createFileRoute("/(calendar)/")({
  component: RouteComponent,
});

type TimeVariant = "available" | "decided" | "pending";

type DeleteTarget = {
  id: string;
  variant: TimeVariant;
};

const deleteDialogConfig = {
  available: {
    title: "Radera tillgänglig tid?",
    description:
      "Det här kommer att radera den tillgängliga tiden. Detta går inte att ångra.",
    confirmLabel: "Radera tid",
  },
  decided: {
    title: "Radera bokad tid?",
    description:
      "Det här kommer att radera den bokade tiden. Detta går inte att ångra.",
    confirmLabel: "Radera bokning",
  },
  pending: {
    title: "Radera väntande tid?",
    description:
      "Det här kommer att radera den väntande tiden. Detta går inte att ångra.",
    confirmLabel: "Radera bokning",
  },
} satisfies Record<
  TimeVariant,
  {
    title: string;
    description: string;
    confirmLabel: string;
  }
>;

function RouteComponent() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [openModal, setOpenModal] = React.useState(false);
  const [month, setMonth] = React.useState(new Date());
  const [popoverOpenId, setPopoverOpenId] = React.useState<string | null>(null);
  const [selectedAvailableTime, setSelectedAvailableTime] =
    React.useState<GetMyAvailableTimesDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = React.useState<DeleteTarget | null>(
    null,
  );
  const [selectedDecidedTime, setSelectedDecidedTime] = React.useState<
    GetAllDecidedTimesDTO | PendingTimeDto | null
  >(null);

  // User and roles
  const user = useCurrentUser();

  const isManager = user.data?.roles.includes("Manager") ?? false;
  const isSubstitute = user.data?.roles.includes("Substitute") ?? false;

  // Substitute queries and mutations
  const AvailableTimeResponse = GetAllAvailableTimes(isSubstitute);
  const KindergartenResponse = GetAllKindergartens(isSubstitute);
  const DeleteAvailableTimeFunction = DeleteAvailableTime();

  // Manager queries
  const AvailableTimesByManagerResponse = useAvailableTimesByManager(isManager);
  const DecidedTimesResponse = GetAllDecidedTimes(undefined, isManager);
  const KindergartenByManagerResponse = GetAllManagerKindergartens(isManager);
  const DeleteDecidedTimeFunction = DeleteDecidedTime();
  const PendingTimesResponse = GetAllPendingTimes(undefined, isManager);
  const DeletePendingTimeFunction = DeletePendingTime();

  // Modal handlers
  const openDialog = (day?: Date) => {
    setDate(day);
    setOpenModal(true);
  };

  const handleCreateTime = (day?: Date) => {
    setSelectedAvailableTime(null);
    setSelectedDecidedTime(null);
    setPopoverOpenId(null);
    openDialog(day);
  };

  const handleEditAvailableTime = (time: GetMyAvailableTimesDTO) => {
    setPopoverOpenId(null);
    setSelectedAvailableTime(time);
    openDialog(new Date(time.startTime));
  };

  const handleEditDecidedTime = (
    time: GetAllDecidedTimesDTO | PendingTimeDto,
  ) => {
    setPopoverOpenId(null);
    setSelectedDecidedTime(time);
    openDialog(new Date(time.startTime));
  };

  const handleDelete = (id: string, variant: TimeVariant) => {
    setPopoverOpenId(null);
    setDeleteTarget({ id, variant });
  };

  const deleteMutations = {
    available: DeleteAvailableTimeFunction,
    decided: DeleteDecidedTimeFunction,
    pending: DeletePendingTimeFunction,
  } satisfies Record<TimeVariant, unknown>;

  const deleteSuccessMessages: Record<TimeVariant, string> = {
    available: "Din tillgängliga tid har tagits bort.",
    decided: "Din bokade tid har tagits bort.",
    pending: "Din väntande tid har tagits bort.",
  };

  const isDeleting = deleteTarget
    ? deleteMutations[deleteTarget.variant].isPending
    : false;

  const confirmDelete = () => {
    if (!deleteTarget || isDeleting) return;

    const { id, variant } = deleteTarget;

    deleteMutations[variant].mutate(id, {
      onSuccess: () => {
        toast.add({
          type: "success",
          title: "Success!",
          description: deleteSuccessMessages[variant],
        });

        setDeleteTarget(null);
      },
      onError: () => {
        toast.add({
          type: "error",
          title: "Åh nej...",
          description: "Något gick fel när tiden skulle tas bort.",
        });
      },
    });
  };

  if (
    AvailableTimeResponse.error ||
    KindergartenResponse.error ||
    user.error ||
    AvailableTimesByManagerResponse.error ||
    KindergartenByManagerResponse.error ||
    DecidedTimesResponse.error ||
    PendingTimesResponse.error
  ) {
    return <div>Error!</div>;
  }

  // Calendar events
  const calendarEvents = isManager
    ? [
        ...(DecidedTimesResponse.data?.decidedTimes ?? []).map((item) => ({
          id: item.decidedTimeId,
          startTime: item.startTime,
          endTime: item.endTime,
          type: "decided" as const,
          original: item,
        })),
        ...(PendingTimesResponse.data?.pendingTimes ?? []).map((item) => ({
          id: item.id,
          startTime: item.startTime,
          endTime: item.endTime,
          type: "pending" as const,
          original: item,
        })),
      ].sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      )
    : (AvailableTimeResponse.data?.availableTimes ?? []).map((item) => ({
        id: item.id,
        startTime: item.startTime,
        endTime: item.endTime,
        type: "available" as const,
        original: item,
      }));

  const isCalendarLoading =
    user.isPending ||
    (isManager
      ? DecidedTimesResponse.isPending || PendingTimesResponse.isPending
      : AvailableTimeResponse.isPending);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-4">
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
        <Button variant="default" onClick={() => handleCreateTime()}>
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
          onSelect={setDate}
          onDayClick={(clickedDate) => {
            handleCreateTime(clickedDate);
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

                          handleCreateTime(day.date);
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
                        onClick={() => handleCreateTime(day.date)}
                      >
                        <PlusIcon />
                        {isManager ? "Boka tid" : "Ny Tid"}
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

                  <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-1 overflow-y-auto">
                    {calendarEvents
                      .filter((item) =>
                        isWithinInterval(day.date, {
                          start: startOfDay(new Date(item.startTime)),
                          end: endOfDay(new Date(item.endTime)),
                        }),
                      )
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

                        if (item.type === "decided") {
                          return (
                            <TimeEntry
                              key={uniqueKey}
                              variant="decided"
                              time={item.original}
                              open={popoverOpenId === uniqueKey}
                              onOpenChange={onOpenChange}
                              onEdit={() =>
                                handleEditDecidedTime(item.original)
                              }
                              onDelete={() =>
                                handleDelete(item.original.decidedTimeId, "decided")
                              }
                              details={
                                <p className="text-muted-foreground">
                                  {item.original.substituteFirstName}{" "}
                                  {item.original.substituteLastName}
                                </p>
                              }
                            />
                          );
                        }
                        if (item.type === "pending") {
                          return (
                            <TimeEntry
                              key={uniqueKey}
                              variant="pending"
                              time={item.original}
                              open={popoverOpenId === uniqueKey}
                              onOpenChange={onOpenChange}
                              onEdit={() =>
                                handleEditDecidedTime(item.original)
                              }
                              onDelete={() =>
                                handleDelete(item.original.id, "pending")
                              }
                              details={
                                <p className="text-muted-foreground">
                                  {item.original.kindergarten.name}
                                </p>
                              }
                            />
                          );
                        }

                        return (
                          <TimeEntry
                            key={uniqueKey}
                            variant="available"
                            time={item.original}
                            open={popoverOpenId === uniqueKey}
                            onOpenChange={onOpenChange}
                            onEdit={() =>
                              handleEditAvailableTime(item.original)
                            }
                            onDelete={() =>
                              handleDelete(item.original.id, "available")
                            }
                            details={
                              <div>
                                <p>Förskolor</p>
                                <p className="text-muted-foreground">
                                  {item.original.kindergartens
                                    .map((kindergarten) => kindergarten.name)
                                    .join(", ")}
                                </p>
                              </div>
                            }
                          />
                        );
                      })}
                  </div>
                </div>
              );
            },
          }}
        />

        {isManager && (
          <ManagerBooking
            open={openModal}
            setOpen={setOpenModal}
            title="Boka tid"
            availableTimes={
              AvailableTimesByManagerResponse.data
                ?.availableTimesByKindergarten ?? []
            }
            kindergartens={KindergartenByManagerResponse}
            submitLabel="Bekräfta Bokning"
            selectedDate={date}
            updateTime={selectedDecidedTime}
          />
        )}

        {isSubstitute && (
          <AddEditTimeModal
            open={openModal}
            setOpen={setOpenModal}
            updateAvailableTime={selectedAvailableTime}
            allKindergartens={KindergartenResponse.data?.kindergartens ?? []}
            selectedDate={date}
          />
        )}
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open && !isDeleting) {
            setDeleteTarget(null);
          }
        }}
        title={
          deleteTarget ? deleteDialogConfig[deleteTarget.variant].title : ""
        }
        description={
          deleteTarget
            ? deleteDialogConfig[deleteTarget.variant].description
            : ""
        }
        confirmLabel={
          deleteTarget
            ? deleteDialogConfig[deleteTarget.variant].confirmLabel
            : ""
        }
        pendingLabel="Raderar..."
        isPending={isDeleting}
        icon={<Trash2Icon />}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
