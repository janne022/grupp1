import type { ReactNode } from "react";
import { Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { GetAllDecidedTimesDTO } from "@/api/models";

type Props = {
  time: GetAllDecidedTimesDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  details?: ReactNode;
};

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function DecidedTimeEntry({
  time,
  open,
  onOpenChange,
  details,
}: Props) {
  const timeRange = `${formatTime(time.startTime)} - ${formatTime(time.endTime)}`;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full min-w-0 items-center gap-2 p-1 text-left hover:bg-primary hover:text-white"
          >
            <span className="size-1.5 shrink-0 rounded-full bg-green-600" />
            <span className="truncate text-sm">Bokad {timeRange}</span>
          </button>
        }
      />

      <PopoverContent
        side="right"
        align="center"
        className="w-80 border bg-popover p-4 text-popover-foreground shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              <Clock className="mr-2 inline-block size-4" />
              Bokad tid
            </h3>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
              aria-label="Stäng"
            >
              <X className="size-4" />
            </Button>
          </div>
          <div className="space-y-2 text-sm">
            <p>
              {new Date(time.startTime).toLocaleDateString("sv-SE", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
              {" · "}
              {timeRange}
            </p>
            {details}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
