import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { User } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type {
  AvailableTimesByKindergartenDTO,
  BookDecidedTimeQuery,
  GetAllDecidedTimesDTO,
  PostPendingTimeResponse,
} from "@/shared/api/models";
import { EditDecidedTime } from "@/features/(calendar)/-api/DecidedTimeService";
import { PostPendingTime } from "@/features/(calendar)/-api/PendingTimeService";
import { filterAvailableTimes } from "../../bookings/-components/substituteDisplay";
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
import BookingSuccess from "./booking-success";

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
  const [bookingResult, setBookingResult] =
    useState<PostPendingTimeResponse | null>(null);
  const isEditing = !!updateDecidedTime;
  const postService = PostPendingTime();
  const editDecidedTimeService = EditDecidedTime();

  // Form
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

  const {
    reset,
    control,
    handleSubmit,
    formState: { isValid },
  } = form;

  useEffect(() => {
    if (!open) {
      setBookingResult(null);
      return;
    }

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
    setSearchQuery("");
    setBookingResult(null);
  }, [open, updateDecidedTime, selectedDate, startTime, endTime, reset]);

  const startDateTime = useWatch({
    control,
    name: "StartDateTime",
  });

  const endDateTime = useWatch({
    control,
    name: "EndDateTime",
  });

  // Convert form values to Date
  const from =
    startDateTime?.date && /^([01]\d|2[0-3]):[0-5]\d$/.test(startDateTime.time)
      ? toDate(startDateTime)
      : undefined;

  const to =
    endDateTime?.date && /^([01]\d|2[0-3]):[0-5]\d$/.test(endDateTime.time)
      ? toDate(endDateTime)
      : undefined;

  // Filter available times
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

  // Submit
  async function onSubmit(data: FormValues) {
    setSubmitError(null);
    setIsSaving(true);

    try {
      // Edit existing booking
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        {bookingResult ? (
          <BookingSuccess data={bookingResult} onClose={() => setOpen(false)} />
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <DialogHeader>
              <DialogTitle className="mx-auto text-center">
                {isEditing ? "Ändra datum och tid" : "Boka vikarie"}
              </DialogTitle>
            </DialogHeader>
            {isEditing && updateDecidedTime && (
              <div className="text-center">
                <p className="text-lg flex flex-row items-center justify-center gap-1 my-0">
                  {updateDecidedTime.kindergartenName ?? "Okänd"}
                </p>

                <p className="text-sm text-muted-foreground flex flex-row items-center justify-center gap-1">
                  <User />
                  {updateDecidedTime.substituteFirstName}{" "}
                  {updateDecidedTime.substituteLastName}
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
                  isSaving ||
                  !isValid ||
                  (!isEditing &&
                    (!selectedKindergarten || !selectedAvailableTime))
                }
              >
                {isSaving
                  ? "Sparar..."
                  : (submitLabel ?? (isEditing ? "Ändra" : "Bekräfta"))}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
