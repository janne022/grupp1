import { EllipsisVertical, Trash2 } from "lucide-react";
import type { BookingData } from "@/api/types/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

type BookingProps = {
  booking: BookingData;
  onDelete: (id: string) => void;
};

function formatDate(time: Date) {
  return time.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}
function formatTime(time: Date) {
  return time.toLocaleTimeString("sv-SE", {
    day: undefined,
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function Booking({ booking, onDelete }: BookingProps) {
  return (
    <article className="relative rounded-xl border p-4 text-sm">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="absolute right-2 top-2 rounded-full p-1 hover:bg-muted"
            />
          }
        >
          <EllipsisVertical className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            variant="destructive"
            onSelect={() => onDelete(booking.id)}
          >
            <Trash2 />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <h3 className="font-medium">{booking.name}</h3>
      <p>{booking.kindergarten}</p>
      <p>{formatDate(booking.startTime)}</p>
      <p>
        {formatTime(booking.startTime)}-{formatTime(booking.endTime)}
      </p>
    </article>
  );
}
