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

export default function Message({
  type,
  startTime,
  endTime,
  kindergartenName,
  acceptHandler,
  rejectHandler,
}: {
  type: string;
  startTime: string;
  endTime: string;
  kindergartenName: string;
  acceptHandler?: () => void;
  rejectHandler?: () => void;
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

  const timeDiff = countTimeDifference(new Date(startTime), new Date(endTime));

  const timeRange = `${formatTime(startTime)} - ${formatTime(endTime)}`;

  return (
    <Card className="mt-3">
      <CardHeader className="gap-3">
        <CardTitle className="text-lg">{kindergartenName}s förskola</CardTitle>
        <CardAction>
          <Badge className="p-3" variant="secondary">
            {type == "pending" ? "bokningsbar" : "bokad"}
          </Badge>
        </CardAction>
        <CardDescription className="flex flex-col gap-1.5">
          <div className="flex justify-start gap-1">
            <CalendarDays size={18} />
            <p>
              {new Date(startTime).toLocaleDateString("sv-SE", {
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
      {type == "pending" && (
        <CardFooter className="flex justify-end gap-3">
          <Button size="icon-lg" variant="destructive" onClick={rejectHandler}>
            <X />
          </Button>
          <Button size="icon-lg" onClick={acceptHandler}>
            <Check />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
