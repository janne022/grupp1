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
  DialogTrigger,
} from "./ui/dialog";

import { Field, FieldGroup } from "./ui/field";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";

import type { KindergartenGroup } from "@/api/types/types";

export default function AddEditTimeModal({
  deleteItem: deleteTime,
  addTime: addTime,
  kindergartens: kindergartens,
}: {
  deleteItem: () => void;
  addTime: () => void;
  kindergartens: KindergartenGroup[];
}) {
  // TODO: Extract Selectgroups to children

  // TODO: Add existing times + kindergratens

  // TODO: Add start date from cal
  return (
    <Dialog>
      <form>
        <DialogTrigger
          render={<Button variant="outline">Open Dialog</Button>}
        />
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader className="flex flex-row justify-between items-center">
            <DialogClose
              render={
                <Button variant="ghost">
                  <XIcon />
                </Button>
              }
            />
            <DialogTitle>Lägg till en tillgänglig tid!</DialogTitle>
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
          </DialogHeader>
          <FieldGroup>
            <Field>
              <DatePickerTime labelName="Startdag" />
            </Field>
            <Field>
              <DatePickerTime labelName="Slutdag" />
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
              Bekräfta
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
