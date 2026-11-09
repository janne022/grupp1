import {
  Calendar,
  CircleCheck,
  CircleQuestionMark,
  Clock,
  School,
} from "lucide-react";

import type { PostPendingTimeResponse } from "@/shared/api/models";

import { Button } from "../../../shared/components/ui/button";
import {
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/components/ui/dialog";
import { Avatar, AvatarFallback } from "../../../shared/components/ui/avatar";

interface BookingSuccessProps {
  data: PostPendingTimeResponse;
  onClose: () => void;
}

export default function BookingSuccess({ data, onClose }: BookingSuccessProps) {
  const startDate = new Date(data.startTime);
  const endDate = new Date(data.endTime);

  return (
    <div className="flex flex-col gap-4">
      <DialogHeader>
        <CircleCheck size={48} className="mx-auto mb-2 text-green-500" />
        <DialogTitle className="text-center">Förfrågan skickad!</DialogTitle>
      </DialogHeader>
      <p className="text-center text-sm text-muted-foreground">
        Din bokning har skapats och förfrågningar har skickats till tillgängliga
        vikarier. Om fler vikarier blir tillgängliga kommer de också att få en
        förfrågan.
      </p>
      <div className="flex flex-col gap-4">
        <h4 className="font-semibold">Bokningsdetaljer</h4>

        {/* Kindergarten */}
        <div className="flex items-center gap-2">
          <School />

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Förskola</span>

            <p>{data.kindergarten.kindergartenName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar />

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Datum</span>

            <p>
              {startDate.toLocaleDateString("sv-SE", {
                dateStyle: "short",
              })}
              {" - "}
              {endDate.toLocaleDateString("sv-SE", {
                dateStyle: "short",
              })}
            </p>
          </div>
        </div>

        {/* Time */}
        <div className="flex items-center gap-2">
          <Clock />

          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">Tid</span>

            <p>
              {startDate.toLocaleTimeString("sv-SE", {
                timeStyle: "short",
              })}
              {" - "}
              {endDate.toLocaleTimeString("sv-SE", {
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <h4 className="font-semibold">Vikarier</h4>

        {data.substitutes.length > 0 ? (
          data.substitutes.map((substitute) => {
            const initials = substitute.fullName
              .trim()
              .split(/\s+/)
              .map((name) => name[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <div
                key={substitute.id}
                className="flex flex-row items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>

                  <div>
                    <h5 className="text-sm font-medium">
                      {substitute.fullName}
                    </h5>

                    <p className="text-xs text-muted-foreground">
                      Förfrågan har skickats
                    </p>
                  </div>
                </div>

                <CircleQuestionMark className="text-muted-foreground" />
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">
            Inga vikarier har fått en förfrågan ännu.
          </p>
        )}
      </div>
      <DialogFooter>
        <Button type="button" onClick={onClose} className="w-full">
          Stäng
        </Button>
      </DialogFooter>
    </div>
  );
}
