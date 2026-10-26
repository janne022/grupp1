import { EllipsisVertical, TrashIcon, XIcon } from "lucide-react";
import { DatePickerTime } from "../date-picker";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

import { Field, FieldGroup } from "./field";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";

import { type Dispatch, type ReactNode, type SetStateAction } from "react";
import { TimePicker } from "./timePicker";

export interface GeneralBookingProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  submitLabel: string;
  onSubmit: () => void;
  onDelete?: () => void;
  startTime?: string;
  endTime?: string;
  children?: ReactNode;
  showOnlyTime?: boolean;
  selectedDate: Date;
  selectedKindergarten?: string | null;
  onStartTimeChange?: (value: string) => void;
  onEndTimeChange?: (value: string) => void;
}

export function GeneralBooking({
  open,
  setOpen,
  title,
  submitLabel,
  onSubmit,
  onDelete,
  startTime,
  endTime,
  children,
  selectedDate,
  selectedKindergarten,
  onStartTimeChange,
  onEndTimeChange,
  showOnlyTime = false,
}: GeneralBookingProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader className="grid grid-cols-[1fr_auto_1fr] items-center">
            <DialogClose
              render={
                <Button variant="ghost" className="justify-start">
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

          {showOnlyTime ? ( //looks dumb but oh well
            <div className="text-center">
              <div className="mb-4">
                <h2 className="text-lg font-semibold">
                  {selectedDate?.toLocaleDateString("sv-SE", {
                    day: "numeric",
                    month: "short",
                  })}
                </h2>
                {selectedKindergarten ? (
                  <p className="text-sm text-muted-foreground">
                    {selectedKindergarten}
                  </p>
                ) : (
                  <span className="text-destructive font-medium">
                    ingen förskola vald
                  </span>
                )}
              </div>
              <section className="flex justify-around">
                <TimePicker
                  label="Starttid"
                  value={startTime ?? "08:00"}
                  onChange={(v) => onStartTimeChange?.(v)}
                />
                <TimePicker
                  label="Sluttid"
                  value={endTime ?? "16:00"}
                  onChange={(v) => onEndTimeChange?.(v)}
                />
              </section>
            </div>
          ) : (
            <FieldGroup>
              <Field>
                <DatePickerTime labelName="Startdag" initialTime={startTime} />
              </Field>
              <Field>
                <DatePickerTime
                  labelName="Slutdag"
                  initialTime={endTime || "16:00"}
                />
              </Field>
            </FieldGroup>
          )}

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
