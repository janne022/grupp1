import { Booking } from "./booking";
import type { BookingData } from "@/api/types/types";

type BookingsDisplayProps = {
  bookings: BookingData[];
  onDelete: (id: string) => void;
};

export function BookingsDisplay({ bookings, onDelete }: BookingsDisplayProps) {
  return (
    <section className="flex h-full flex-col rounded-2xl border p-3">
      <h2 className="mb-2 text-center font-medium">Bokningar</h2>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {bookings.length === 0 ? (
          <p className="text-center">
            Inga Bokningar
          </p>
        ) : (
          bookings.map((b) => (
            <Booking key={b.id} booking={b} onDelete={onDelete} />
          ))
        )}
      </div>
    </section>
  );
}