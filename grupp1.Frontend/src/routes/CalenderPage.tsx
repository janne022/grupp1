import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import React from "react";

export const Route = createFileRoute("/CalenderPage")({
  component: RouteComponent,
});

interface AllDayInfo {
  UserInfo: unknown;
  StartTime: Date;
  EndTime: Date;
  SchoolsSelected: unknown;
}

function RouteComponent() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [open, setOpen] = React.useState(false);

  function openDialog(day?: Date) {
    setDate(day);
    setOpen(true);
  }

  return (
    <div className="mx-auto max-w-3xl flex flex-col items-center gap-4 ">
      <Button variant="outline" onClick={() => openDialog()}>
        New Time
      </Button>

      <Calendar
        locale={sv}
        mode="single"
        selected={date}
        onDayClick={openDialog}
        disabled={{ dayOfWeek: [0, 6] }}
        className="rounded-lg border [--cell-size:3rem] "
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogTitle>
            {date
              ? `Day ${date.getDate()}, 
            month ${date.getMonth() + 1}, 
            year ${date.getFullYear()}`
              : "No date selected"}
          </DialogTitle>
          <div>
            <h1>AAAAAAAAAAAAAA</h1>
          </div>
          <DialogDescription>
            {date
              ? `Day ${date.getDate()}, 
            month ${date.getMonth() + 1}, 
            year ${date.getFullYear()}`
              : "No date selected"}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}
