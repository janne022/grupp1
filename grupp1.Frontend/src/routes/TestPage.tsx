import type { KindergartenGroup } from "@/api/types/types";
import AddEditTimeModal from "@/components/addEditTimeModal";
import AddEditTimeModalTest from "@/components/AddEditTimeModalTEST";
import BookTimeModal, {
  type AvailableTimeInfo,
} from "@/components/BookTimeModal";
import { TimeModal } from "@/components/TimeModal";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { createFileRoute } from "@tanstack/react-router";
import { sv } from "date-fns/locale";
import React from "react";

export const Route = createFileRoute("/TestPage")({
  component: RouteComponent,
});

function RouteComponent() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  function openDialog(day?: Date) {
    setDate(day);
    setOpen(true);
  }
  const kindergarten: KindergartenGroup[] = [
    {
      groupName: "hej",
      kindergartens: [{ label: "köttbullen", value: "ur mom" }],
    },
    {
      groupName: "hej då",
      kindergartens: [{ label: "pastan", value: "ur dad" }],
    },
  ];

  const availableTimeInfo: AvailableTimeInfo[] = [];

  function onSubmit() {
    return;
  }
  function onDelete() {
    return;
  }

  return (
    <>
      <div>Hello "/TestPage"!</div>
      <Calendar
        locale={sv}
        mode="single"
        selected={date}
        onDayClick={openDialog}
        disabled={{ dayOfWeek: [0, 6] }}
        className="rounded-lg border [--cell-size:3rem] "
        title="wdawwda"
      />
      {/* original */}
      {/* <AddEditTimeModal
        open={open}
        setOpen={setOpen}
        deleteItem={onDelete}
        addTime={onSubmit}
        kindergartens={kindergarten}
      /> */}

      {/* edited original "inheritence" type shit */}
      {/* <AddEditTimeModalTest
        onSubmit={onSubmit}
        deleteItem={onDelete}
        kindergartens={kindergarten}
        open={open}
        setOpen={setOpen}
      /> */}

      {/* BOOKING MODAL NYNYNYYNYNYNN POGGIES*/}
      <BookTimeModal
        open={open}
        setOpen={setOpen}
        onSubmit={onSubmit}
        title="BOOKING"
        availableTimes={availableTimeInfo}
        submitLabel="confirm booking"
      />
    </>
  );
}
