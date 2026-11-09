import { Badge } from "@/shared/components/ui/badge";
import { CalendarDays, Check, Clock8, X } from "lucide-react";
import { useState } from "react";

export default function Message({
  kindergarten,
  date,
  time,
}: {
  kindergarten: string;
  date: string;
  time: string;
}) {
  const [status, setStatus] = useState("pending");

  return (
    <div>
      <div className="flex justify-between">
        <h2>{kindergarten}</h2>
        <Badge />
      </div>
      <div className="flex justify-start">
        <CalendarDays />
        <p>{date}</p>
      </div>
      <div className="flex justify-between">
        <Clock8 />
        <p>
          {time} <span>(8h)</span>
        </p>
      </div>
      <hr />
      <div className="flex justify-end">
        <div>
          <X />
        </div>
        <div>
          <Check />
        </div>
      </div>
    </div>
  );
}
