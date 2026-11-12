import type { PendingTimeDto } from "@/shared/api/models";
import {
  AcceptPendingTime,
  RejectPendingTime,
} from "../-api/PendingTimeService";
import { toast } from "@/shared/components/ui/toast";
import Message from "./message";

export default function PendingMessage({
  pendingTime,
}: {
  pendingTime: PendingTimeDto;
}) {
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
    <Message
      type="pending"
      startTime={pendingTime.startTime}
      endTime={pendingTime.endTime}
      kindergartenName={pendingTime.kindergarten.name}
      acceptHandler={handleAccept}
      rejectHandler={handleDelete}
    />
  );
}
