import type { GetAllDecidedTimesDTO } from "@/shared/api/models";
import Message from "./message";

export default function DecidedMessage({
  decidedTime,
}: {
  decidedTime: GetAllDecidedTimesDTO;
}) {
  return (
    <Message
      type="decided"
      startTime={decidedTime.startTime}
      endTime={decidedTime.endTime}
      kindergartenName={decidedTime.kindergartenName}
    />
  );
}
