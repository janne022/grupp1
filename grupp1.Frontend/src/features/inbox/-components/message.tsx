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

export default function PendingMessage({
  pendingTime,
}: {
  pendingTime: PendingTimeDto;
}) {
  return (
    <Card className="m-5">
      <CardHeader className="gap-3">
        <CardTitle>{pendingTime.kindergarten.name}s förskola</CardTitle>
        <CardAction>
          <Badge className="bg-amber-200 text-yellow-700">pending</Badge>
        </CardAction>
        <CardDescription className="flex flex-col gap-1.5">
          <div className="flex justify-start gap-1">
            <CalendarDays />
            <p>{pendingTime.startTime}</p>
          </div>
          <div className="flex justify-start gap-1">
            <Clock8 />
            <p>
              {pendingTime.startTime}
              <span> (8h)</span>
            </p>
          </div>
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex justify-end gap-2">
        <Button size="icon" variant="destructive">
          <X />
        </Button>
        <Button size="icon">
          <Check />
        </Button>
      </CardFooter>
    </Card>
  );
}
