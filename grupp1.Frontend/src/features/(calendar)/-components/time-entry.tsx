import type { ReactNode } from "react";
import { Clock, PenLine, Trash, X } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/shared/components/ui/context-menu";

type Props = {
  time: {
    startTime: string;
    endTime: string;
  };
  variant: "available" | "decided";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  details?: ReactNode;
};

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function TimeEntry({
  time,
  variant,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  details,
}: Props) {
  const isAvailable = variant === "available";

  const title = isAvailable ? "Tillgänglig tid" : "Bokad tid";
  const label = isAvailable ? "Tillgänglig" : "Bokad";
  const dotColor = isAvailable ? "bg-blue-600" : "bg-green-600";

  const timeRange = `${formatTime(time.startTime)} - ${formatTime(time.endTime)}`;

  const popover = (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full min-w-0 items-center gap-2 p-1 text-left hover:bg-primary hover:text-white"
          >
            <span className={`size-1.5 shrink-0 rounded-full ${dotColor}`} />
            <span className="truncate text-sm">
              {label} {timeRange}
            </span>
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
              {title}
            </h3>
            <div className="flex items-center">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onEdit}
                  aria-label="Ändra tid"
                >
                  <PenLine className="size-4 text-blue-400" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={onDelete}
                  aria-label="Radera tid"
                >
                  <Trash className="size-4 text-destructive" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => onOpenChange(false)}
                aria-label="Stäng"
              >
                <X className="size-4" />
              </Button>
            </div>
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

  return (
    <ContextMenu>
      <ContextMenuTrigger className="w-full">{popover}</ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>{title}</ContextMenuLabel>
          <ContextMenuItem
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            <PenLine />
            Ändra
          </ContextMenuItem>

          <ContextMenuItem
            variant="destructive"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash />
            Radera
          </ContextMenuItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  );
}
