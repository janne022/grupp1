import ManagerBooking from "@/components/ui/managerBooking";
import { Calendar } from "@/components/ui/calendar";
import type { AvailableTimesByManagerDTO } from "@/api/models";
import { createFileRoute } from "@tanstack/react-router";
import { sv } from "date-fns/locale";
import React from "react";
import { useAvailableTimesByManager } from "@/api/services/AvailableTimeByManagerService";
import { KindergartenDropDown } from "@/components/ui/kindergartenDropDown";

export const Route = createFileRoute("/TestPage")({
  component: RouteComponent,
});

function RouteComponent() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date>(new Date());
  const [selectedName, setSelectedName] = React.useState<string | null>(null);
  const { data, isPending } = useAvailableTimesByManager();

  const kindergartenNames =
    data?.availableTimesByKindergarten.map((k) => k.kindergartenName) ?? [];
  const activeName = selectedName ?? kindergartenNames[0] ?? null;

  const timesForKindergarten: AvailableTimesByManagerDTO[] =
    data?.availableTimesByKindergarten.find(
      (k) => k.kindergartenName === activeName,
    )?.availableTimes ?? [];

  function openDialog(day: Date) {
    setDate(day);
    setOpen(true);
  }

  return (
    <>
      <KindergartenDropDown
        kindergartensNames={kindergartenNames}
        selectedKindergarten={activeName}
        onSelect={setSelectedName}
        disabled={isPending}
      />
      <Calendar
        locale={sv}
        mode="single"
        selected={date}
        onDayClick={openDialog}
        disabled={{ dayOfWeek: [0, 6] }}
        className="rounded-lg border [--cell-size:3rem]"
      />

      <ManagerBooking
        open={open}
        setOpen={setOpen}
        title="Boka tid"
        availableTimes={timesForKindergarten}
        submitLabel="Bekräfta Bokning"
        Loading={isPending}
        selectedDate={date}
        selectedKindergarten={activeName}
        showOnlyTime={true}
      />
    </>
  );
}
