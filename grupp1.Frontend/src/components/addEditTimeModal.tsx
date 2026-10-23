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

const formSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  kindergartens: z.array(z.string()),
});

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startDate: undefined,
      endDate: undefined,
      kindergartens: [],
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    login.mutate({
      email: data.email,
      password: data.password,
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
              name="startDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <DatePickerTime
                    {...field}
                    labelName="Startdag"
                    initialTime={existingStartTime || "08:00"}
                    intialDate={selectedDate}
                  />
                </Field>
              )}
            />
            <Controller
              name="endDate"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <DatePickerTime
                    {...field}
                    labelName="Slutdag"
                    initialTime={existingEndTime || "16:00"}
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
            <Button type="submit">{isEdit ? "Ändra" : "Bekräfta"}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
