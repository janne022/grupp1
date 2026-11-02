import type { GetMyAvailableTimesDTO } from "@/api/models";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Clock, PenLine, Trash, X } from "lucide-react";

type Props = {
  time: GetMyAvailableTimesDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (time: GetMyAvailableTimesDTO) => void;
  onDelete: (id: string) => void;
};

const formatTime = (value: string) =>
  new Date(value).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });

export default function AvailableTimeEntry({
  time,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: Props) {
  const edit = () => {
    onOpenChange(false);
    onEdit(time);
  };

  const remove = () => {
    onOpenChange(false);
    onDelete(time.id);
  };

  const timeRange = `${formatTime(time.startTime)} - ${formatTime(time.endTime)}`;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger
        render={
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="w-full min-w-0 p-1 text-left hover:bg-primary hover:text-white"
          >
            <ContextMenu>
              <ContextMenuTrigger className="flex min-w-0 items-center gap-2">
                <span className="size-1.5 shrink-0 rounded-full bg-blue-600" />
                <span className="truncate text-sm">
                  Tillgänglig {timeRange}
                </span>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuGroup>
                  <ContextMenuLabel>Tillgänglig tid</ContextMenuLabel>
                  <ContextMenuItem onClick={edit}>
                    <PenLine /> Ändra
                  </ContextMenuItem>
                  <ContextMenuItem variant="destructive" onClick={remove}>
                    <Trash /> Radera
                  </ContextMenuItem>
                </ContextMenuGroup>
              </ContextMenuContent>
            </ContextMenu>
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
              Tillgänglig tid
            </h3>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={edit}
                aria-label="Ändra tid"
              >
                <PenLine className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={remove}
                aria-label="Radera tid"
              >
                <Trash className="size-4 text-destructive" />
              </Button>
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
            <div>
              <p>Förskolor</p>
              <p className="text-muted-foreground">
                {time.kindergartens
                  .map((kindergarten) => kindergarten.name)
                  .join(", ")}
              </p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
