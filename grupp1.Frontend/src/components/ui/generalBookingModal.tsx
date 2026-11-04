import { EllipsisVertical, TrashIcon, XIcon } from "lucide-react";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import { FieldGroup } from "./field";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./dropdown-menu";
import type { Dispatch, ReactNode, SetStateAction } from "react";
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
  selectedDate?: Date;
  selectedKindergarten?: string | null;
  onStartTimeChange?: (value: string) => void;
  onEndTimeChange?: (value: string) => void;
  submitDisabled?: boolean;
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
  submitDisabled = false,
}: GeneralBookingProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false} className="sm:max-w-sm">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <DialogHeader className="flex flex-row items-center gap-0">
            <DialogTitle className="text-center mx-auto">{title}</DialogTitle>

            <DialogClose
              render={
                <Button type="button" variant="ghost" className="m-0 p-0">
                  <XIcon />
                </Button>
              }
            />
          </DialogHeader>

          <div className="text-center">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">
                {selectedDate?.toLocaleDateString("sv-SE", {
                  day: "numeric",
                  month: "short",
                }) ?? "Inget datum valt"}
              </h2>

              {selectedKindergarten ? (
                <p className="text-sm text-muted-foreground">
                  {selectedKindergarten}
                </p>
              ) : (
                <span className="font-medium text-destructive">
                  Ingen förskola vald
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

          {children && <FieldGroup>{children}</FieldGroup>}

          <DialogFooter className="flex flex-row justify-between">
            <DialogClose
              render={
                <Button type="button" variant="outline">
                  Avbryt
                </Button>
              }
            />

            <Button type="submit" disabled={submitDisabled}>
              {submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
