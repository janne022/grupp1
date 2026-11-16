import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { Clock, User } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type {
  AvailableTimesByKindergartenDTO,
  AvailableTimesByManagerDTO,
  GetAllDecidedTimesDTO,
  GetAllKindergartensResponse,
  PendingTimeDto,
  PostPendingTimeRequest,
  PostPendingTimeResponse,
} from "@/shared/api/models";
import { EditDecidedTime } from "@/features/(calendar)/-api/DecidedTimeService";
import {
  EditPendingTime,
  PostPendingTime,
} from "@/features/(calendar)/-api/PendingTimeService";
import { Button } from "../../../shared/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "../../../shared/components/ui/field";
import {
  RadioGroup,
  RadioGroupItem,
} from "../../../shared/components/ui/radio-group";
import { ScrollArea } from "../../../shared/components/ui/scroll-area";
import { Input } from "../../../shared/components/ui/input";
import type { UseQueryResult } from "@tanstack/react-query";
import BookingSuccess from "./booking-success";
import { Calendar } from "@/shared/components/ui/calendar";
import { cn } from "cn";
import { sv } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

interface BookTimeProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedDate?: Date;
  availableTimes?: AvailableTimesByKindergartenDTO[];
  kindergartens?: UseQueryResult<GetAllKindergartensResponse | null, Error>;
  startTime?: string;
  endTime?: string;
  title?: string;
  submitLabel?: string;
  updateTime?: EditableTime | null;
}

export type EditableTime = GetAllDecidedTimesDTO | PendingTimeDto;

function isPendingTime(time: EditableTime): time is PendingTimeDto {
  return "kindergarten" in time;
}

type EditTarget = {
  kind: "decided" | "pending";
  id: string;
  kindergartenId: string;
  kindergartenName: string;
  startTime: string;
  endTime: string;
  substituteName: string | null;
};

function toEditTarget(time: EditableTime): EditTarget {
  if (isPendingTime(time)) {
    return {
      kind: "pending",
      id: time.id,
      kindergartenId: time.kindergarten.id,
      kindergartenName: time.kindergarten.name,
      startTime: time.startTime,
      endTime: time.endTime,
      substituteName: null,
    };
  }

  return {
    kind: "decided",
    id: time.timeId,
    kindergartenId: time.kindergartenId,
    kindergartenName: time.kindergartenName,
    startTime: time.startTime,
    endTime: time.endTime,
    substituteName: `${time.substituteFirstName} ${time.substituteLastName}`,
  };
}

type DateTimeValue = {
  date: Date;
  time: string;
};

type FormValues = {
  StartDateTime: DateTimeValue;
  EndDateTime: DateTimeValue;
};

type Period = {
  days: Date[];
  startTime: string;
  endTime: string;
};

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

function getWeekdaysInRange(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(
    start.getFullYear(),
    start.getMonth(),
    start.getDate(),
  );
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  while (current <= last) {
    const weekday = current.getDay();

    if (weekday !== 0 && weekday !== 6) {
      days.push(new Date(current));
    }

    current.setDate(current.getDate() + 1);
  }

  return days;
}

function atTime(day: Date, time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date(day);

  date.setHours(hours, minutes, 0, 0);

  return date;
}

function getPersonKey(slot: AvailableTimesByManagerDTO): string {
  return String(slot.substitute.id);
}

function countAvailableSubstitutes(
  slots: AvailableTimesByManagerDTO[],
  period: Period,
): number {
  if (period.days.length === 0) {
    return 0;
  }

  const slotsByPerson = new Map<string, AvailableTimesByManagerDTO[]>();

  for (const slot of slots) {
    const key = getPersonKey(slot);
    slotsByPerson.set(key, [...(slotsByPerson.get(key) ?? []), slot]);
  }

  let count = 0;

  for (const personSlots of slotsByPerson.values()) {
    const availableEveryDay = period.days.every((day) => {
      const windowStart = atTime(day, period.startTime);
      const windowEnd = atTime(day, period.endTime);

      return personSlots.some(
        (slot) =>
          new Date(slot.startTime) <= windowStart &&
          new Date(slot.endTime) >= windowEnd,
      );
    });

    if (availableEveryDay) {
      count++;
    }
  }

  return count;
}

function splitDateTime(dateTime: string | Date): DateTimeValue {
  const parsedDate =
    typeof dateTime === "string"
      ? new Date(dateTime)
      : new Date(dateTime.getTime());

  return {
    date: new Date(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate(),
    ),
    time: `${String(parsedDate.getHours()).padStart(2, "0")}:${String(
      parsedDate.getMinutes(),
    ).padStart(2, "0")}`,
  };
}

function hasDateTimeChanged(current: DateTimeValue, original: string): boolean {
  const previous = splitDateTime(original);

  return (
    current.date.toDateString() !== previous.date.toDateString() ||
    current.time !== previous.time
  );
}

function toDate(dateTime: DateTimeValue): Date {
  const [hours, minutes] = dateTime.time.split(":").map(Number);
  const date = new Date(dateTime.date);

  date.setHours(hours, minutes, 0, 0);

  return date;
}

function toIsoDateTime(dateTime: DateTimeValue): string {
  return toDate(dateTime).toISOString();
}

const dateTimeSchema = z.object({
  date: z.date(),
  time: z.string().regex(TIME_REGEX, "Ange en giltig tid"),
});

const formSchema = z
  .object({
    StartDateTime: dateTimeSchema,
    EndDateTime: dateTimeSchema,
  })
  .refine((data) => data.StartDateTime.time < data.EndDateTime.time, {
    message: "Sluttiden måste vara efter starttiden",
    path: ["EndDateTime"],
  });

type FormSchemaValues = z.infer<typeof formSchema>;

function getInitialValues(
  editTarget: EditTarget | null,
  selectedDate: Date | undefined,
  startTime: string,
  endTime: string,
): FormValues {
  if (editTarget) {
    return {
      StartDateTime: splitDateTime(editTarget.startTime),
      EndDateTime: splitDateTime(editTarget.endTime),
    };
  }

  const date = selectedDate ? new Date(selectedDate) : new Date();

  const normalizedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );

  return {
    StartDateTime: { date: normalizedDate, time: startTime },
    EndDateTime: { date: normalizedDate, time: endTime },
  };
}

export default function ManagerBooking({
  open,
  setOpen,
  ...props
}: BookTimeProps) {
  const formKey = `${props.updateTime ? toEditTarget(props.updateTime).id : "new"}-${
    props.selectedDate?.getTime() ?? "none"
  }`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className={cn(
          "flex max-h-[calc(100dvh-2rem)] flex-col overflow-y-auto",
          props.updateTime ? "sm:max-w-md" : "sm:max-w-3xl",
        )}
      >
        {open && (
          <ManagerBookingForm
            key={formKey}
            onClose={() => setOpen(false)}
            {...props}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type ManagerBookingFormProps = Omit<BookTimeProps, "open" | "setOpen"> & {
  onClose: () => void;
};

function ManagerBookingForm({
  onClose,
  selectedDate,
  availableTimes = [],
  kindergartens,
  startTime = "08:00",
  endTime = "16:00",
  title,
  submitLabel,
  updateTime = null,
}: ManagerBookingFormProps) {
  const editTarget = useMemo(
    () => (updateTime ? toEditTarget(updateTime) : null),
    [updateTime],
  );
  const isEditing = !!editTarget;
  const isEditingPending = editTarget?.kind === "pending";

  const [initialValues] = useState(() =>
    getInitialValues(editTarget, selectedDate, startTime, endTime),
  );

  const [selectedKindergartenId, setSelectedKindergartenId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookingResult, setBookingResult] =
    useState<PostPendingTimeResponse | null>(null);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>(
    () => ({
      from: initialValues.StartDateTime.date,
      to: initialValues.EndDateTime.date,
    }),
  );
  const [calendarMonth, setCalendarMonth] = useState(
    () => initialValues.StartDateTime.date,
  );

  const postService = PostPendingTime();
  const editDecidedTimeService = EditDecidedTime();
  const editPendingTimeService = EditPendingTime();

  const form = useForm<FormSchemaValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: initialValues,
  });

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
  } = form;

  const startDateTime = useWatch({
    control,
    name: "StartDateTime",
  });

  const endDateTime = useWatch({
    control,
    name: "EndDateTime",
  });

  const period: Period | null =
    startDateTime?.date &&
    endDateTime?.date &&
    TIME_REGEX.test(startDateTime.time) &&
    TIME_REGEX.test(endDateTime.time) &&
    startDateTime.time < endDateTime.time
      ? {
          days: getWeekdaysInRange(startDateTime.date, endDateTime.date),
          startTime: startDateTime.time,
          endTime: endDateTime.time,
        }
      : null;

  const availableCountByKindergarten = new Map<string, number>();

  if ((!isEditing || isEditingPending) && period) {
    for (const kindergarten of availableTimes) {
      availableCountByKindergarten.set(
        kindergarten.kindergartenId,
        countAvailableSubstitutes(kindergarten.availableTimes, period),
      );
    }
  }

  const totalAvailable = [...availableCountByKindergarten.values()].reduce(
    (total, count) => total + count,
    0,
  );

  const kindergartenList = kindergartens?.data?.kindergartens ?? [];

  const visibleKindergartens = kindergartenList.filter((kindergarten) =>
    kindergarten.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const effectiveSelectedKindergartenId = visibleKindergartens.some(
    (kindergarten) => kindergarten.id === selectedKindergartenId,
  )
    ? selectedKindergartenId
    : (visibleKindergartens[0]?.id ?? "");

  const selectedKindergarten = visibleKindergartens.find(
    (kindergarten) => kindergarten.id === effectiveSelectedKindergartenId,
  );

  function handleRangeSelect(_range: DateRange | undefined, clickedDate: Date) {
    const pendingStart =
      selectedRange?.from && !selectedRange.to ? selectedRange.from : null;

    const next: DateRange =
      pendingStart && clickedDate >= pendingStart
        ? { from: pendingStart, to: clickedDate }
        : { from: clickedDate, to: undefined };

    setSelectedRange(next);

    const startDate = next.from ?? clickedDate;
    const endDate = next.to ?? startDate;
    const options = { shouldDirty: true, shouldValidate: true };

    setValue(
      "StartDateTime",
      { ...getValues("StartDateTime"), date: startDate },
      options,
    );
    setValue(
      "EndDateTime",
      { ...getValues("EndDateTime"), date: endDate },
      options,
    );
  }

  async function onSubmit(data: FormSchemaValues) {
    setSubmitError(null);
    setIsSaving(true);

    try {
      if (editTarget) {
        const hasStartTimeChanged = hasDateTimeChanged(
          data.StartDateTime,
          editTarget.startTime,
        );

        const hasEndTimeChanged = hasDateTimeChanged(
          data.EndDateTime,
          editTarget.endTime,
        );

        if (!hasStartTimeChanged && !hasEndTimeChanged) {
          onClose();
          return;
        }

        const changes = {
          id: editTarget.id,
          kindergartenId: editTarget.kindergartenId,
          startTime: hasStartTimeChanged
            ? toIsoDateTime(data.StartDateTime)
            : null,
          endTime: hasEndTimeChanged ? toIsoDateTime(data.EndDateTime) : null,
        };

        if (editTarget.kind === "pending") {
          await editPendingTimeService.mutateAsync(changes);
        } else {
          await editDecidedTimeService.mutateAsync(changes);
        }

        onClose();
        return;
      }

      if (!selectedKindergarten) {
        setSubmitError("Välj en förskola.");
        return;
      }

      const booking: PostPendingTimeRequest = {
        kindergartenId: selectedKindergarten.id,
        startTime: toIsoDateTime(data.StartDateTime),
        endTime: toIsoDateTime(data.EndDateTime),
      };

      const response = await postService.mutateAsync(booking);

      if (!response) {
        throw new Error("No booking response received");
      }

      setBookingResult(response);
    } catch {
      setSubmitError("Det gick inte att spara bokningen. Försök igen.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      {bookingResult ? (
        <BookingSuccess data={bookingResult} onClose={onClose} />
      ) : (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="mx-auto text-center">
              {editTarget?.kind === "pending"
                ? "Ändra väntande tid"
                : editTarget?.kind === "decided"
                  ? "Ändra bokad tid"
                  : (title ?? "Boka vikarie")}
            </DialogTitle>
          </DialogHeader>

          {editTarget && (
            <div className="text-center">
              <p className="my-0 flex flex-row items-center justify-center gap-1 text-lg">
                {editTarget.kindergartenName || "Okänd"}
              </p>

              {editTarget.kind === "decided" ? (
                <p className="flex flex-row items-center justify-center gap-1 text-sm text-muted-foreground">
                  <User />
                  {editTarget.substituteName}
                </p>
              ) : (
                <p className="flex flex-row items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Clock />
                  Väntar på vikarie
                  {period &&
                    ` · ${
                      availableCountByKindergarten.get(
                        editTarget.kindergartenId,
                      ) ?? 0
                    } tillgängliga vikarier just nu`}
                </p>
              )}
            </div>
          )}

          <div className={cn("grid gap-6", !isEditing && "sm:grid-cols-2")}>
            <FieldGroup>
              <Controller
                name="StartDateTime"
                control={control}
                render={({ fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <Calendar
                      mode="range"
                      disabled={[
                        { before: new Date(new Date().setHours(0, 0, 0, 0)) },
                        { dayOfWeek: [0, 6] },
                      ]}
                      locale={sv}
                      month={calendarMonth}
                      onMonthChange={setCalendarMonth}
                      weekStartsOn={1}
                      className="w-full p-0"
                      classNames={{
                        root: "relative w-full",
                        month: "flex w-full flex-col gap-1",
                        nav: "absolute top-0 left-1/2 z-10 flex h-7 w-56 -translate-x-1/2 items-center justify-between",
                        month_caption: "flex h-7 items-center justify-center",
                        caption_label: "text-sm font-medium",
                        weekdays: "grid w-full grid-cols-5",
                        week: "mt-1 grid w-full grid-cols-5",
                        day: "group/day relative h-[clamp(1.75rem,5dvh,2.5rem)] min-w-0 rounded-md p-0 text-center nth-[n+6]:hidden",
                      }}
                      selected={selectedRange}
                      onSelect={handleRangeSelect}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <FieldTitle className="font-semibold">
                Välj tidsintervall
              </FieldTitle>

              <div className="flex flex-row items-center gap-2">
                <Controller
                  name="StartDateTime"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        min="06:00"
                        max="18:00"
                        type="time"
                        step="60"
                        value={field.value.time}
                        onChange={(event) =>
                          field.onChange({
                            ...field.value,
                            time: event.target.value,
                          })
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <p className="flex items-center">till</p>

                <Controller
                  name="EndDateTime"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <Input
                        min="06:00"
                        max="18:00"
                        type="time"
                        step="60"
                        value={field.value.time}
                        onChange={(event) =>
                          field.onChange({
                            ...field.value,
                            time: event.target.value,
                          })
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="EndDateTime"
                control={control}
                render={({ fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    {fieldState.error?.message && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            {!isEditing && (
              <FieldGroup className="min-h-0">
                <div className="flex h-full min-h-0 flex-col gap-4">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle className="font-semibold">
                        Alla förskolor
                      </FieldTitle>

                      <FieldDescription>
                        {totalAvailable} tillgängliga vikarier just nu
                      </FieldDescription>
                    </FieldContent>
                  </Field>

                  <Input
                    type="search"
                    placeholder="Sök förskola..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                  />

                  <div className="relative min-h-40 w-full sm:flex-1">
                    <ScrollArea className="max-h-72 w-full sm:absolute sm:inset-0 sm:max-h-none">
                      <RadioGroup
                        value={effectiveSelectedKindergartenId}
                        onValueChange={setSelectedKindergartenId}
                        className="w-full max-w-none"
                      >
                        {kindergartens?.isError ? (
                          <p className="text-center text-sm text-destructive">
                            Det gick inte att hämta förskolorna.
                          </p>
                        ) : visibleKindergartens.length === 0 ? (
                          <p className="text-center text-sm text-muted-foreground">
                            Ingen förskola hittades.
                          </p>
                        ) : (
                          visibleKindergartens.map((kindergarten) => {
                            const availableCount =
                              availableCountByKindergarten.get(
                                kindergarten.id,
                              ) ?? 0;

                            return (
                              <FieldLabel
                                key={kindergarten.id}
                                htmlFor={kindergarten.id}
                              >
                                <Field orientation="horizontal">
                                  <FieldContent>
                                    <FieldTitle className="font-semibold">
                                      {kindergarten.name}
                                    </FieldTitle>

                                    <FieldDescription className="text-sm text-muted-foreground">
                                      {availableCount} tillgängliga vikarier
                                      just nu
                                    </FieldDescription>
                                  </FieldContent>

                                  <RadioGroupItem
                                    id={kindergarten.id}
                                    value={kindergarten.id}
                                  />
                                </Field>
                              </FieldLabel>
                            );
                          })
                        )}
                      </RadioGroup>
                    </ScrollArea>
                  </div>
                </div>
              </FieldGroup>
            )}
          </div>

          {submitError && (
            <p role="alert" className="text-sm text-destructive">
              {submitError}
            </p>
          )}

          <DialogFooter className="flex flex-row justify-between">
            <DialogClose
              render={
                <Button type="button" variant="outline" disabled={isSaving}>
                  Avbryt
                </Button>
              }
            />

            <Button
              type="submit"
              disabled={
                isSaving || !isValid || (!isEditing && !selectedKindergarten)
              }
            >
              {isSaving
                ? "Sparar..."
                : isEditing
                  ? "Spara ändringar"
                  : (submitLabel ?? "Bekräfta")}
            </Button>
          </DialogFooter>
        </form>
      )}
    </>
  );
}
