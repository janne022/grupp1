import type { BookingData } from "@/shared/types/types";
import { BookingsDisplay } from "@/features/bookings/-components/booking-display";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bookings/")({
  component: RouteComponent,
});

const TESTDATAREMOVELATER: BookingData[] = [
  {
    id: "1",
    name: "Alice Bergstroem",
    kindergarten: "Solrosen",
    startTime: new Date("2026-10-20T08:00"),
    endTime: new Date("2026-10-20T16:00"),
  },
  {
    id: "3",
    name: "Alice Bergström",
    kindergarten: "Solrosen",
    startTime: new Date("2026-10-20T08:00"),
    endTime: new Date("2026-10-20T16:00"),
  },
  {
    id: "3",
    name: "Alice Bergström",
    kindergarten: "Solrosen",
    startTime: new Date("2026-10-20T08:00"),
    endTime: new Date("2026-10-20T16:00"),
  },
  {
    id: "4",
    name: "Alice Bergström",
    kindergarten: "Solrosen",
    startTime: new Date("2026-10-20T08:00"),
    endTime: new Date("2026-10-20T16:00"),
  },
  {
    id: "5",
    name: "Alice Bergström",
    kindergarten: "Solrosen",
    startTime: new Date("2026-10-20T08:00"),
    endTime: new Date("2026-10-20T16:00"),
  },
  {
    id: "6",
    name: "Alice Bergström",
    kindergarten: "Solrosen",
    startTime: new Date("2026-10-20T08:00"),
    endTime: new Date("2026-10-20T16:00"),
  },
];

function RouteComponent() {
  function deleteBooking(id: string) {
    //api call here /api/decidedtime/delete/{id}
  }

  return (
    <div className="h-125 w-80">
      <BookingsDisplay
        bookings={TESTDATAREMOVELATER}
        onDelete={deleteBooking}
      />
    </div>
  );
}
