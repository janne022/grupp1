import { DatePickerTime } from "./date-picker";
import { SelectGroups } from "./selectGroups";
import { Button } from "./ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

import { Field, FieldError, FieldGroup } from "./ui/field";

import React, { useEffect, type Dispatch } from "react";
import type { GetMyAvailableTimesDTO, KindergartenDto } from "@/api/models";
import {
  AddAvailableTime,
  EditAvailableTime,
} from "@/api/services/AvailableTimeService";
import { XIcon } from "lucide-react";

export default function AddEditTimeModal({
  open: open,
  setOpen: setOpen,
  selectedDate: selectedDate,
  updateAvailableTime: updateAvailableTime,
  allKindergartens: kindergartens,
}: {
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  selectedDate?: Date | undefined;
  updateAvailableTime: GetMyAvailableTimesDTO | null;
  allKindergartens: KindergartenDto[];
}) {
  // TODO: Extract Selectgroups to children

  function splitDateTime(dateTime: string | Date) {
    const date = new Date(dateTime);

    return {
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      time: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
    };
  }

  function hasDateTimeChanged(
    current: { date: Date; time: string },
    original: string,
  ): boolean {
    const previous = splitDateTime(original);

    return (
      current.date.toDateString() !== previous.date.toDateString() ||
      current.time !== previous.time
    );
  }

  function toIsoDateTime(dateTime: { date: Date; time: string }) {
    const [hours, minutes] = dateTime.time.split(":").map(Number);

    const date = new Date(dateTime.date);
    date.setHours(hours, minutes, 0, 0);

    return date.toISOString();
  }

  const dateTime = z.object({ date: z.date(), time: z.string() });

  const formSchema = z
    .object({
      StartDateTime: dateTime,
      EndDateTime: dateTime,
      kindergartens: z.array(z.string()),
    })
    .refine(
      (data) =>
        new Date(toIsoDateTime(data.StartDateTime)) <
        new Date(toIsoDateTime(data.EndDateTime)),
      {
        message: "Sluttiden måste vara efter starttiden",
        path: ["EndDateTime"],
      },
    );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      StartDateTime: splitDateTime(
        updateAvailableTime?.startTime ?? selectedDate ?? new Date(),
      ),
      EndDateTime: splitDateTime(
        updateAvailableTime?.endTime ?? selectedDate ?? new Date(),
      ),
      kindergartens: updateAvailableTime?.kindergartens.map((k) => k.id) ?? [],
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (!open) return;

    reset({
      StartDateTime: updateAvailableTime
        ? splitDateTime(updateAvailableTime.startTime)
        : {
            date: selectedDate ?? new Date(),
            time: "08:00",
          },

      EndDateTime: updateAvailableTime
        ? splitDateTime(updateAvailableTime.endTime)
        : {
            date: selectedDate ?? new Date(),
            time: "16:00",
          },

      kindergartens: updateAvailableTime?.kindergartens.map((k) => k.id) ?? [],
    });
  }, [open, updateAvailableTime, selectedDate, reset]);
  const postService = AddAvailableTime();
  const editService = EditAvailableTime();

  function onSubmit(data: z.infer<typeof formSchema>) {
    if (updateAvailableTime) {
      // Check if any of the fields have changed

      const hasStartTimeChanged = hasDateTimeChanged(
        data.StartDateTime,
        updateAvailableTime.startTime,
      );

      const hasEndTimeChanged = hasDateTimeChanged(
        data.EndDateTime,
        updateAvailableTime.endTime,
      );

      const hasKindergartensChanged =
        data.kindergartens.length !==
          updateAvailableTime.kindergartens.length ||
        !data.kindergartens.every((id) =>
          updateAvailableTime.kindergartens.some((k) => k.id === id),
        );

      // If none of the fields have changed, close the modal and return
      if (
        !hasStartTimeChanged &&
        !hasEndTimeChanged &&
        !hasKindergartensChanged
      ) {
        setOpen(false);
        return;
      }

      editService.mutate({
        availableTimeId: updateAvailableTime.id,
        startTime: hasStartTimeChanged
          ? toIsoDateTime(data.StartDateTime)
          : null,
        endTime: hasEndTimeChanged ? toIsoDateTime(data.EndDateTime) : null,
        kindergartens: hasKindergartensChanged ? data.kindergartens : null,
      });
      setOpen(false);
      return;
    }

    postService.mutate({
      startTime: toIsoDateTime(data.StartDateTime),
      endTime: toIsoDateTime(data.EndDateTime),
      kindergartens: data.kindergartens,
    });

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e.valueOf())}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <form
          className="flex flex-col gap-4"
          id="add-availabletime-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <DialogHeader className="flex flex-row items-center gap-0">
            <DialogTitle className="text-center mx-auto">
              {updateAvailableTime
                ? "Ändra din tid"
                : "Lägg till en tillgänglig tid!"}
            </DialogTitle>
            <DialogClose
              render={
                <Button variant="ghost" className="m-0 p-0">
                  <XIcon />
                </Button>
              }
            />
          </DialogHeader>
          <FieldGroup>
            <Controller
              name="StartDateTime"
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <DatePickerTime
                      {...field}
                      labelName="Startdag"
                      onChange={(x) => {
                        field.onChange(x);
                      }}
                    />
                  </Field>
                );
              }}
            />
            <Controller
              name="EndDateTime"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <DatePickerTime
                    {...field}
                    labelName="Slutdag"
                    onChange={(x) => {
                      field.onChange(x);
                    }}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name="kindergartens"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex flex-col items-center"
                >
                  <FieldError errors={[fieldState.error]} />
                  <SelectGroups {...field} KindergartenDto={kindergartens} />
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter className="flex flex-row justify-between">
            <DialogClose render={<Button variant="outline">Avbryt</Button>} />
            <Button form="add-availabletime-form" type="submit">
              {updateAvailableTime ? "Ändra" : "Bekräfta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
