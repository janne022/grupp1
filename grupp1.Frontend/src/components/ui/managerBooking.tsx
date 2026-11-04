import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { XIcon } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import type {
  AvailableTimesByKindergartenDTO,
  BookDecidedTimeQuery,
  GetAllDecidedTimesDTO,
} from "@/api/models";
import { AddDecidedTime } from "@/api/services/DecidedTimeService";
import { filterAvailableTimes } from "./substituteDisplay";

import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "./field";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { ScrollArea } from "./scroll-area";
import { DatePickerTime } from "../date-picker";
import { Input } from "./input";

interface EditDecidedTimeData {
  decidedTimeId: string;
  startTime: string | null;
  endTime: string | null;
}

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
  onEdit?: (data: EditDecidedTimeData) => Promise<unknown>;
}

type DateTimeValue = {
  date: Date;
  time: string;
};

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
  onEdit,
}: BookTimeProps) {
  const [selectedKindergartenId, setSelectedKindergartenId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const isEditing = !!updateDecidedTime;
  const postService = AddDecidedTime();

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

  const filtered: AvailableTimesByKindergartenDTO[] =
    !isEditing && from && to && from < to
      ? availableTimes
          .map((kindergarten) => ({
            ...kindergarten,
            availableTimes: filterAvailableTimes(
              kindergarten.availableTimes,
              from,
              to,
            ),
          }))
          .filter((kindergarten) => kindergarten.availableTimes.length > 0)
          .filter((kindergarten) =>
            kindergarten.kindergartenName
              .toLowerCase()
              .includes(searchQuery.toLowerCase()),
          )
      : [];

  const totalAvailable = filtered.reduce(
    (total, kindergarten) => total + kindergarten.availableTimes.length,
    0,
  );

  const selectedKindergarten = filtered.find(
    (kindergarten) => kindergarten.kindergartenId === selectedKindergartenId,
  );

  const selectedAvailableTime = selectedKindergarten?.availableTimes[0];

  async function onSubmit(data: FormValues) {
    setSubmitError(null);
    setIsSaving(true);

    try {
      if (updateDecidedTime) {
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

        if (!onEdit) return;

        await onEdit({
          decidedTimeId: updateDecidedTime.timeId,
          startTime: hasStartTimeChanged
            ? toIsoDateTime(data.StartDateTime)
            : null,
          endTime: hasEndTimeChanged ? toIsoDateTime(data.EndDateTime) : null,
        });

        setOpen(false);
        return;
      }

      // CREATE MODE
      if (!selectedKindergarten || !selectedAvailableTime) {
        return;
      }

      const booking: BookDecidedTimeQuery = {
        availableTimeGuid: selectedAvailableTime.id,
        kindergartenId: selectedKindergarten.kindergartenId,
        startTime: toIsoDateTime(data.StartDateTime),
        endTime: toIsoDateTime(data.EndDateTime),
      };

      await postService.mutateAsync(booking);

      setOpen(false);
    } catch {
      setSubmitError("Det gick inte att spara bokningen. Försök igen.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="flex flex-row items-center gap-0">
            <DialogTitle className="mx-auto text-center">
              {isEditing ? "Ändra datum och tid" : "Boka vikarie"}
            </DialogTitle>

            <DialogClose
              render={
                <Button type="button" variant="ghost" className="m-0 p-0">
                  <XIcon />
                </Button>
              }
            />
          </DialogHeader>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {isEditing &&
                `Vald förskola: ${updateDecidedTime.kindergartenName ?? "Okänd"}`}
            </p>
          </div>

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
                    value={selectedKindergartenId}
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
