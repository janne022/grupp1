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

import { Field, FieldGroup } from "./ui/field";

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

  let isEdit = false;

  if (updateAvailableTime) {
    isEdit = true;
  }

  function splitDateTime(dateTime: string | Date) {
    const date = new Date(dateTime);

    return {
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      time: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
    };
  }

  const dateTime = z.object({ date: z.date(), time: z.string() });

  const formSchema = z.object({
    StartDateTime: dateTime,
    EndDateTime: dateTime,
    kindergartens: z.array(z.string()),
  });

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
    if (isEdit) {
      editService.mutate({
        availableTimeId: "",
        startTime: null,
        endTime: null,
        kindergartens: data.kindergartens,
      });
      return;
    }

    postService.mutate({
      startTime: new Date(
        `${data.StartDateTime.date.toLocaleDateString("sv-SE")}T${data.StartDateTime.time}:00`,
      ).toISOString(),
      endTime: new Date(
        `${data.EndDateTime.date.toLocaleDateString("sv-SE")}T${data.EndDateTime.time}:00`,
      ).toISOString(),
      kindergartens: data.kindergartens,
    });
  }

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e.valueOf())}>
      <form id="add-availabletime-form" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader className="flex flex-row items-center gap-0">
            <DialogTitle className="text-center mx-auto">
              {isEdit ? "Ändra din tid" : "Lägg till en tillgänglig tid!"}
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
                  <SelectGroups {...field} KindergartenDto={kindergartens} />
                </Field>
              )}
            />
          </FieldGroup>
          <DialogFooter className="flex flex-row justify-between">
            <DialogClose render={<Button variant="outline">Avbryt</Button>} />
            <Button form="add-availabletime-form" type="submit">
              {isEdit ? "Ändra" : "Bekräfta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
