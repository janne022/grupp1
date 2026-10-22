import { EllipsisVertical, TrashIcon, XIcon } from "lucide-react";
import { DatePickerTime } from "./date-picker";
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

import { type Dispatch, type ReactNode, type SetStateAction } from "react";

export interface TimeModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  submitLabel: string;
  onSubmit: () => void;
  onDelete?: () => void;
  startTime?: string;
  endTime?: string;
  children?: ReactNode;
}

export function TimeModal({
  open,
  setOpen,
  title,
  submitLabel,
  onSubmit,
  onDelete,
  startTime,
  endTime,
  children,
}: TimeModalProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader className="flex flex-row justify-between items-center">
            <DialogClose
              render={
                <Button variant="ghost">
                  <XIcon />
                </Button>
              }
            />
            <DialogTitle>{title}</DialogTitle>
            {onDelete ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="ghost">
                      <EllipsisVertical />
                    </Button>
                  }
                />
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={onDelete} variant="destructive">
                    <TrashIcon /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div />
            )}
          </DialogHeader>

          <FieldGroup>
            <Field>
              <DatePickerTime 
                labelName="Startdag" 
                initialTime={startTime} 
              />
            </Field>
            <Field>
              <DatePickerTime
                labelName="Slutdag"
                initialTime={endTime || "16:00"}
              />
            </Field>
          </FieldGroup>

          {children && <FieldGroup>{children}</FieldGroup>}

          <DialogFooter className="flex flex-row justify-between">
            <DialogClose render={<Button variant="outline">Avbryt</Button>} />
            <Button type="submit">{submitLabel}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
