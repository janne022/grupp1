import { TimeModal, type TimeModalProps } from "./TimeModal";
import { Field } from "./ui/field";
export interface AvailableTimeInfo {
  StartTime: Date;
  endTime: Date;
  SubstituteInfo: SubstituteInfo;
}

interface SubstituteInfo {
  firstName: string;
  lastName: string;
}
interface BookTimeProps extends Omit<
  TimeModalProps,
  "onDelete" | "addTime" | "children"
> {
  availableTimes: AvailableTimeInfo[];
}

export default function BookTimeModal({
  open,
  setOpen,
  availableTimes,
  startTime,
  endTime,
  ...rest
}: BookTimeProps) {
  return (
    <TimeModal
      {...rest}
      open={open}
      setOpen={setOpen}
      startTime={startTime}
      endTime={endTime || "16:00"}
    >
      <Field></Field>
    </TimeModal>
  );
}
