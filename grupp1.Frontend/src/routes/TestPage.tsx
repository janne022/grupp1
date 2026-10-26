import type { KindergartenGroup } from "@/api/types/types";
import AddEditTimeModal from "@/components/ui/addEditTimeModal";
import ManagerBooking from "@/components/ui/managerBooking";
import { Calendar } from "@/components/ui/calendar";
import { createFileRoute } from "@tanstack/react-router";
import { sv } from "date-fns/locale";
import React from "react";

export const Route = createFileRoute("/TestPage")({
  component: RouteComponent,
});

export interface AvailableTimesResponse {
  kindergartens: KindergartenAvailability[];
}

export interface KindergartenAvailability {
  kindergartenId: string;
  name: string;
  availableTimes: AvailableTimeInfo[];
}

export interface AvailableTimeInfo {
  id: string;
  startTime: string; //ex: "2026-10-26T09:00:00Z" //the "Z" means that this is UTC sweden is utc +1 fyifyi
  endTime: string;
  firstName: string;
  lastName: string;
}

function RouteComponent() {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date>(new Date());

  function openDialog(day: Date) {
    setDate(day);
    setOpen(true);
  }
  const kindergarten: KindergartenGroup[] = [
    {
      groupName: "hej",
      kindergartens: [{ label: "Chas Academy", value: "ur mom" }],
    },
    {
      groupName: "hej då",
      kindergartens: [{ label: "pastan", value: "ur dad" }],
    },
  ];

  const allTimes: KindergartenAvailability[] = [
    {
      kindergartenId: "01a14445-3e1c-74de-8ba4-b2bf89c289e1",
      name: "Chas Academy",
      availableTimes: [
        {
          id: "764fa3f6-b558-459f-95ef-9dfb0613b507",
          startTime: "2026-10-26T06:00:00Z",
          endTime: "2026-10-26T19:00:00Z",
          firstName: "john",
          lastName: "sub",
        },
        {
          id: "8b1c7664-932e-47b5-ba33-4bc95ed2be96",
          startTime: "2026-10-28T06:00:00Z",
          endTime: "2026-10-28T19:00:00Z",
          firstName: "AAAA",
          lastName: "långtefternamn",
        },
        {
          id: "cf93c7ac-5dd3-4613-b5f6-cccaa9f31377",
          startTime: "2026-10-29T06:00:00Z",
          endTime: "2026-10-29T19:00:00Z",
          firstName: "johnnnnnyy",
          lastName: "ännulängreefternamn",
        },
        {
          id: "e21b7235-2bc8-4be8-8d01-8ded95c11e64",
          startTime: "2026-10-30T06:00:00Z",
          endTime: "2026-10-30T19:00:00Z",
          firstName: "AAAA",
          lastName: "subs",
        },
        {
          id: "ee908213-5fc1-4e9c-8433-59762160a549",
          startTime: "2026-10-27T06:00:00Z",
          endTime: "2026-10-27T19:00:00Z",
          firstName: "bBBBBbb",
          lastName: "subs",
        },
      ],
    },
  ];

  const filterByKindergarten = (
    allTimes: KindergartenAvailability[],
    kindergartenId: string,
  ): AvailableTimeInfo[] =>
    allTimes.find((k) => k.name === kindergartenId)?.availableTimes ?? [];

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

      <ManagerBooking
        open={open}
        setOpen={setOpen}
        title="Boka tid"
        availableTimes={filterByKindergarten(allTimes, "Chas Academy")}
        submitLabel="Bekräfta Bokning"
        Loading={false}
        selectedDate={date}
        selectedKindergarten="Chas Academy"
        showOnlyTime={true}
      />

      {/*This is the refactor version of AddEditTimeModal. Should look identical to the old one*/}
      {/* <AddEditTimeModal
        open={open}
        setOpen={setOpen}
        deleteItem={onDelete}
        onSubmit={onSubmit}
        kindergartens={kindergarten}
        selectedDate={date}
      /> */}
    </>
  );
}
