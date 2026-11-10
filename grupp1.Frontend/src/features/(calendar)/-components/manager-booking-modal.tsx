import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import {
  Calendar,
  CircleCheck,
  CircleQuestionMark,
  Clock,
  School,
  User,
} from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import type {
  AvailableTimesByKindergartenDTO,
  AvailableTimesByManagerDTO,
  BookDecidedTimeQuery,
  GetAllDecidedTimesDTO,
  PostPendingTimeResponse,
} from "@/shared/api/models";
import { EditDecidedTime } from "@/features/(calendar)/-api/DecidedTimeService";

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
import { DatePickerTime } from "../../../shared/components/ui/date-picker";
import { Input } from "../../../shared/components/ui/input";
import { PostPendingTime } from "@/features/(calendar)/-api/PendingTimeService";
import { Avatar, AvatarFallback } from "../../../shared/components/ui/avatar";

interface BookTimeProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedDate?: Date;
  availableTimes?: AvailableTimesByKindergartenDTO[];
  startTime?: string;
  endTime?: string;
  title?: string;
  submitLabel?: string;

  updateDecidedTime?: GetAllDecidedTimesDTO | null;
}

type DateTimeValue = {
  date: Date;
  time: string;
};

function filterAvailableTimes(
  times: AvailableTimesByManagerDTO[],
  from: Date,
  to: Date,
) {
  return times.filter((t) => {
    const availableFrom = new Date(t.startTime);
    const availableTo = new Date(t.endTime);
    return availableFrom <= from && availableTo >= to;
  });
}

function splitDateTime(dateTime: string | Date): DateTimeValue {
  const date = new Date(dateTime);

  return {
    date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    time: `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes(),
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
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Ange en giltig tid"),
});

const formSchema = z
  .object({
    StartDateTime: dateTimeSchema,
    EndDateTime: dateTimeSchema,
  })
  .refine((data) => toDate(data.StartDateTime) < toDate(data.EndDateTime), {
    message: "Sluttiden måste vara efter starttiden",
    path: ["EndDateTime"],
  });

type FormValues = z.infer<typeof formSchema>;

export default function ManagerBooking({
  open,
  setOpen,
  selectedDate,
  availableTimes = [],
  startTime = "08:00",
  endTime = "16:00",
  submitLabel,
  updateDecidedTime = null,
}: BookTimeProps) {
  const [selectedKindergartenId, setSelectedKindergartenId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingTimeSuccess, setPendingTimeSuccess] = useState(false);
  const [pendingTimeData, setPendingTimeData] =
    useState<PostPendingTimeResponse | null>(null);

  const isEditing = !!updateDecidedTime;
  const postService = PostPendingTime();
  const editDecidedTimeService = EditDecidedTime();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      StartDateTime: updateDecidedTime
        ? splitDateTime(updateDecidedTime.startTime)
        : {
            date: selectedDate ?? new Date(),
            time: startTime,
          },

      EndDateTime: updateDecidedTime
        ? splitDateTime(updateDecidedTime.endTime)
        : {
            date: selectedDate ?? new Date(),
            time: endTime,
          },
    },
  });

  const { reset, control, handleSubmit } = form;

  useEffect(() => {
    if (!open) return;

    reset({
      StartDateTime: updateDecidedTime
        ? splitDateTime(updateDecidedTime.startTime)
        : {
            date: selectedDate ?? new Date(),
            time: startTime,
          },

      EndDateTime: updateDecidedTime
        ? splitDateTime(updateDecidedTime.endTime)
        : {
            date: selectedDate ?? new Date(),
            time: endTime,
          },
    });

    setSelectedKindergartenId("");
    setSubmitError(null);
  }, [open, updateDecidedTime, selectedDate, startTime, endTime, reset]);

  const startDateTime = useWatch({
    control,
    name: "StartDateTime",
  });

  const endDateTime = useWatch({
    control,
    name: "EndDateTime",
  });

  const from =
    startDateTime?.date && /^([01]\d|2[0-3]):[0-5]\d$/.test(startDateTime.time)
      ? toDate(startDateTime)
      : undefined;

  const to =
    endDateTime?.date && /^([01]\d|2[0-3]):[0-5]\d$/.test(endDateTime.time)
      ? toDate(endDateTime)
      : undefined;

  const filtered: AvailableTimesByKindergartenDTO[] = !isEditing
    ? availableTimes
        .map((kindergarten) => ({
          ...kindergarten,
          availableTimes:
            from && to && from < to
              ? filterAvailableTimes(kindergarten.availableTimes, from, to)
              : kindergarten.availableTimes,
        }))
        .filter((kindergarten) =>
          kindergarten.kindergartenName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
        )
    : [];

  const effectiveSelectedKindergartenId = filtered.some(
    (kindergarten) => kindergarten.kindergartenId === selectedKindergartenId,
  )
    ? selectedKindergartenId
    : (filtered[0]?.kindergartenId ?? "");

  const totalAvailable = filtered.reduce(
    (total, kindergarten) => total + kindergarten.availableTimes.length,
    0,
  );

  const selectedKindergarten = filtered.find(
    (kindergarten) =>
      kindergarten.kindergartenId === effectiveSelectedKindergartenId,
  );

  const selectedAvailableTime = selectedKindergarten?.availableTimes[0];

  async function onSubmit(data: FormValues) {
    setSubmitError(null);
    setIsSaving(true);

    try {
      if (updateDecidedTime) {
        // Edit booking
        const hasStartTimeChanged = hasDateTimeChanged(
          data.StartDateTime,
          updateDecidedTime.startTime,
        );

        const hasEndTimeChanged = hasDateTimeChanged(
          data.EndDateTime,
          updateDecidedTime.endTime,
        );

        if (!hasStartTimeChanged && !hasEndTimeChanged) {
          setOpen(false);
          return;
        }

        await editDecidedTimeService.mutateAsync({
          id: updateDecidedTime.timeId,
          kindergartenId: updateDecidedTime.kindergartenId,
          startTime: hasStartTimeChanged
            ? toIsoDateTime(data.StartDateTime)
            : null,
          endTime: hasEndTimeChanged ? toIsoDateTime(data.EndDateTime) : null,
        });

        setOpen(false);
        return;
      }

      // Create new booking
      if (!selectedKindergarten || !selectedAvailableTime) {
        return;
      }

      const booking: BookDecidedTimeQuery = {
        availableTimeGuid: selectedAvailableTime.id,
        kindergartenId: selectedKindergarten.kindergartenId,
        startTime: toIsoDateTime(data.StartDateTime),
        endTime: toIsoDateTime(data.EndDateTime),
      };

      const response = await postService.mutateAsync(booking);
      setPendingTimeData(response);

      if (response) {
        setPendingTimeSuccess(true);
      }
    } catch {
      setSubmitError("Det gick inte att spara bokningen. Försök igen.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="mx-auto text-center">
              {isEditing ? "Ändra datum och tid" : "Boka vikarie"}
            </DialogTitle>
          </DialogHeader>

          {pendingTimeSuccess && pendingTimeData ? (
            <div className="flex flex-col gap-4">
              <CircleCheck size={48} className="mx-auto mb-2 text-green-500" />
              <h3 className="text-center text-lg font-semibold">
                Förfrågan skickad!
              </h3>
              <p className="text-center text-sm text-muted-foreground">
                Din bokning har skapats och förfrågningar har skickats till
                tillgänliga vikarier. Om fler vikarier blir tillgängliga kommer
                de också att få en förfrågan.
              </p>
              <h4 className="font-semibold">Bokningsdetaljer</h4>
              <div className="flex flex-row gap-2 items-center">
                <School />
                <div className="flex flex-col">
                  <h5 className="text-muted-foreground text-xs m-0 p-0">
                    Förskola
                  </h5>
                  <p className="m-0 p-0">{pendingTimeData.kindergarten.name}</p>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Calendar />
                <div className="flex flex-col">
                  <h5 className="text-muted-foreground text-xs m-0 p-0">
                    Datum
                  </h5>
                  <p className="m-0 p-0">
                    {new Date(pendingTimeData.startTime).toLocaleString(
                      "sv-SE",
                      {
                        dateStyle: "short",
                      },
                    )}{" "}
                    -
                    {new Date(pendingTimeData.endTime).toLocaleString("sv-SE", {
                      dateStyle: "short",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <Clock />
                <div className="flex flex-col">
                  <h5 className="text-muted-foreground text-xs m-0 p-0">Tid</h5>
                  <p className="m-0 p-0">
                    {new Date(pendingTimeData.startTime).toLocaleString(
                      "sv-SE",
                      {
                        timeStyle: "short",
                      },
                    )}{" "}
                    -
                    {new Date(pendingTimeData.endTime).toLocaleString("sv-SE", {
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-4">
                <h3 className="font-semibold">Vikarier</h3>
                {pendingTimeData.substitutes.map((substitute) => (
                  <div
                    key={substitute.id}
                    className="mt-2 flex flex-row gap-2 items-center justify-between"
                  >
                    <div className="flex flex-row gap-2">
                      <Avatar>
                        <AvatarFallback>
                          {substitute.fullName
                            .split(" ")
                            .map((name) => name[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-md">{substitute.fullName}</h4>
                        <p className="text-xs text-muted-foreground">
                          Förfrågan har skickats
                        </p>
                      </div>
                    </div>
                    <CircleQuestionMark className="text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {isEditing && (
                <div className="text-center">
                  <p className="text-lg flex flex-row items-center justify-center gap-1 my-0">
                    {isEditing &&
                      `${updateDecidedTime.kindergartenName ?? "Okänd"}`}
                  </p>
                  <p className="text-sm text-muted-foreground flex flex-row items-center justify-center gap-1">
                    <User />
                    {isEditing &&
                      `${updateDecidedTime.substituteFirstName} ${updateDecidedTime.substituteLastName}`}
                  </p>
                </div>
              )}

              <FieldGroup>
                <Controller
                  name="StartDateTime"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <DatePickerTime
                        {...field}
                        labelName="Startdag"
                        onChange={field.onChange}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="EndDateTime"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <DatePickerTime
                        {...field}
                        labelName="Slutdag"
                        onChange={field.onChange}
                      />

                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>

              {!isEditing && (
                <FieldGroup>
                  <ScrollArea className="max-h-72 w-full">
                    <div className="space-y-4">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle className="font-semibold">
                            Alla förskolor
                          </FieldTitle>
                          <FieldDescription>
                            {totalAvailable} tillgängliga vikarier
                          </FieldDescription>
                        </FieldContent>
                      </Field>

                      <Input
                        type="search"
                        placeholder="Sök förskola..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />

                      <RadioGroup
                        value={effectiveSelectedKindergartenId}
                        onValueChange={setSelectedKindergartenId}
                        className="max-w-sm"
                      >
                        {filtered.length === 0 ? (
                          <p className="text-center text-sm text-muted-foreground">
                            Ingen förskola hittades.
                          </p>
                        ) : (
                          filtered.map((kindergarten) => (
                            <FieldLabel
                              key={kindergarten.kindergartenId}
                              htmlFor={kindergarten.kindergartenId}
                            >
                              <Field orientation="horizontal">
                                <FieldContent>
                                  <FieldTitle className="font-semibold">
                                    {kindergarten.kindergartenName}
                                  </FieldTitle>

                                  <FieldDescription className="text-sm text-muted-foreground">
                                    {kindergarten.availableTimes.length}{" "}
                                    tillgängliga vikarier
                                  </FieldDescription>
                                </FieldContent>

                                <RadioGroupItem
                                  value={kindergarten.kindergartenId}
                                  id={kindergarten.kindergartenId}
                                />
                              </Field>
                            </FieldLabel>
                          ))
                        )}
                      </RadioGroup>
                    </div>
                  </ScrollArea>
                </FieldGroup>
              )}

              {submitError && (
                <p role="alert" className="text-sm text-destructive">
                  {submitError}
                </p>
              )}
            </>
          )}

          <DialogFooter className="flex flex-row justify-between">
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Avbryt
                </Button>
              }
            />

            <Button type="submit">
              {isSaving
                ? "Sparar..."
                : (submitLabel ?? (isEditing ? "Ändra" : "Bekräfta"))}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
