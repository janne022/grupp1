import { EllipsisVertical, TrashIcon, XIcon } from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

import React, { type Dispatch } from "react";
import type { KindergartenDto } from "@/api/models";
import { AddAvailableTime } from "@/api/services/AvailableTimeService";

export default function AddEditTimeModal({
  open: open,
  setOpen: setOpen,
  deleteItem: deleteTime,
  kindergartens: kindergartens,
  selectedDate: selectedDate,
  existingStartTime: existingStartTime,
  existingEndTime: existingEndTime,
}: {
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  deleteItem: () => void;
  kindergartens: KindergartenDto[];
  selectedDate?: Date | undefined;
  existingStartTime?: string;
  existingEndTime?: string;
}) {
  // TODO: Extract Selectgroups to children

  const dateTime = z.object({ date: z.date(), time: z.string() });

  const formSchema = z.object({
    StartDateTime: dateTime,
    EndDateTime: dateTime,
    kindergartens: z.array(z.string()),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      StartDateTime: {
        date: new Date(),
        time: "08:00",
      },
      EndDateTime: {
        date: new Date(),
        time: "16:00",
      },
      kindergartens: [],
    },
  });

  const postService = AddAvailableTime();

  function onSubmit(data: z.infer<typeof formSchema>) {
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

  let isEdit = false;

  if (existingEndTime && existingStartTime) {
    isEdit = true;
  }

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e.valueOf())}>
      <form id="add-availabletime-form" onSubmit={form.handleSubmit(onSubmit)}>
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader className="flex flex-row justify-between items-center">
            <DialogClose
              render={
                <Button variant="ghost">
                  <XIcon />
                </Button>
              }
            />
            <DialogTitle>
              {isEdit ? "Ändra din tid" : "Lägg till en tillgänglig tid!"}
            </DialogTitle>

            {isEdit ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost">
                      <EllipsisVertical />
                    </Button>
                  }
                />
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={deleteTime} variant="destructive">
                    <TrashIcon />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div></div>
            )}
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
                  <DatePickerTime {...field} labelName="Slutdag" />
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
