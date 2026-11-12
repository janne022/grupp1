import type { PendingTimeDto } from "@/shared/api/models";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { CalendarDays, Check, Clock8, X } from "lucide-react";

import {
  AcceptPendingTime,
  RejectPendingTime,
} from "../-api/PendingTimeService";
import { toast } from "@/shared/components/ui/toast";

export default function PendingMessage({
  pendingTime,
}: {
  pendingTime: PendingTimeDto;
}) {
  const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const countTimeDifference = (start: Date, end: Date) => {
    const difference = Math.abs(end.getTime() - start.getTime());

    return {
      milliseconds: difference,
      seconds: Math.floor(difference / 1000),
      minutes: Math.floor(difference / 60000),
      hours: Math.floor(difference / 3600000),
      days: Math.floor(difference / 86400000),
    };
  };

  const timeDiff = countTimeDifference(
    new Date(pendingTime.startTime),
    new Date(pendingTime.endTime),
  );

  const timeRange = `${formatTime(pendingTime.startTime)} - ${formatTime(pendingTime.endTime)}`;

  const rejectPendingTimeFunction = RejectPendingTime();
  const acceptPendingTimeFunction = AcceptPendingTime();

  function handleDelete() {
    rejectPendingTimeFunction.mutate(pendingTime.id, {
      onSuccess: () => {
        toast.add({
          type: "success",
          title: "Tack!",
          description: "Du har tackat nej till passet.",
        });
      },
      onError: () => {
        toast.add({
          type: "error",
          title: "Åh nej...",
          description: "Något gick fel...",
        });
      },
    });
  }

  function handleAccept() {
    acceptPendingTimeFunction.mutate(pendingTime.id, {
      onSuccess: () => {
        toast.add({
          type: "success",
          title: "najs!",
          description: "Du har tackat ja till passet!",
        });
      },
      onError: () => {
        toast.add({
          type: "error",
          title: "Åh nej...",
          description: "Något gick fel...",
        });
      },
    });
  }

  return (
    <Card className="mt-3">
      <CardHeader className="gap-3">
        <CardTitle className="text-lg">
          {pendingTime.kindergarten.name}s förskola
        </CardTitle>
        <CardAction>
          <Badge className="p-3" variant="secondary">Bokningsbar</Badge>
        </CardAction>
        <CardDescription className="flex flex-col gap-1.5">
          <div className="flex justify-start gap-1">
            <CalendarDays size={18} />
            <p>
              {new Date(pendingTime.startTime).toLocaleDateString("sv-SE", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
          <div className="flex justify-start gap-1 items-center">
            <Clock8 size={16} />
            <p>{timeRange}</p>
            <p className="text-xs">({timeDiff.hours}h pass)</p>
          </div>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end gap-3">
        <Button size="icon-lg" variant="destructive" onClick={handleDelete}>
          <X />
        </Button>
        <Button size="icon-lg" onClick={handleAccept}>
          <Check />
        </Button>
      </CardFooter>
    </Card>
  );
}
