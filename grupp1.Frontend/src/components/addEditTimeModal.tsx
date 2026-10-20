import { EllipsisVertical, TrashIcon, XIcon } from "lucide-react";
import { DatePickerTime } from "./date-picker";
import { SelectGroups } from "./selectGroups";
import { Button } from "./ui/button";
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

import type { KindergartenGroup } from "@/api/types/types";
import React, { type Dispatch } from "react";

export default function AddEditTimeModal({
  open: open,
  setOpen: setOpen,
  deleteItem: deleteTime,
  addTime: addTime,
  kindergartens: kindergartens,
  selectedTime: selectedTime,
  existingStartTime: existingStartTime,
  existingEndTime: existingEndTime,
}: {
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  deleteItem: () => void;
  addTime: () => void;
  kindergartens: KindergartenGroup[];
  selectedTime?: string;
  existingStartTime?: string;
  existingEndTime?: string;
}) {
  // TODO: Extract Selectgroups to children

  let isEdit = false;

  if (existingEndTime && existingStartTime) {
    isEdit = true;
  }

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e.valueOf())}>
      <form>
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
            <Field>
              <DatePickerTime
                labelName="Startdag"
                initialTime={existingStartTime || selectedTime}
              />
            </Field>
            <Field>
              <DatePickerTime
                labelName="Slutdag"
                initialTime={existingEndTime || "16:00"}
              />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field className="flex flex-col items-center">
              <SelectGroups KindergartenGroups={kindergartens} />
            </Field>
          </FieldGroup>
          <DialogFooter className="flex flex-row justify-between">
            <DialogClose render={<Button variant="outline">Avbryt</Button>} />
            <Button onClick={addTime} type="submit">
              {isEdit ? "Ändra" : "Bekräfta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
