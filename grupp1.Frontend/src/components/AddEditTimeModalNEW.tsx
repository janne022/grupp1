import type { KindergartenGroup } from "@/api/types/types";

import { Field } from "./ui/field";
import { SelectGroups } from "./selectGroups";
import { GeneralBooking, type GeneralBookingProps } from "./generalBookingModal";


interface AddEditTimeModalProps extends Omit<
  GeneralBookingProps,
  "title" | "submitLabel" | "onDelete" | "children" | "startTime" | "endTime"
> {
  deleteItem: () => void;
  kindergartens: KindergartenGroup[];
  selectedTime?: string;
  existingStartTime?: string;
  existingEndTime?: string;
}

export default function AddEditTimeModalNew({
  deleteItem,
  kindergartens,
  selectedTime,
  existingStartTime,
  existingEndTime,
  ...rest
}: AddEditTimeModalProps) {
  const isEdit = Boolean(existingStartTime && existingEndTime);

  return (
    <GeneralBooking
      {...rest}
      title={isEdit ? "Ändra din tid" : "Lägg till en tillgänglig tid!"}
      submitLabel={isEdit ? "Ändra" : "Bekräfta"}
      onDelete={isEdit ? deleteItem : undefined}
      startTime={existingStartTime || selectedTime}
      endTime={existingEndTime || "16:00"}
    >
      <Field className="flex flex-col items-center">
        <SelectGroups KindergartenGroups={kindergartens} />
      </Field>
    </GeneralBooking>
  );
}
