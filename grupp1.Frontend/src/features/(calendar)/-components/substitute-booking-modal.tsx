import { SelectGroups } from "./selectGroups";
import { Button } from "../../../shared/components/ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../shared/components/ui/dialog";

import {
  Field,
  FieldError,
  FieldGroup,
} from "../../../shared/components/ui/field";

import React, { type Dispatch } from "react";
import type {
  GetMyAvailableTimesDTO,
  KindergartenDto,
} from "@/shared/api/models";
import {
  AddAvailableTime,
  EditAvailableTime,
} from "@/features/(calendar)/-api/AvailableTimeService";
import { XIcon } from "lucide-react";
import {
  DateRangeTimeFields,
  type DateTimeValue,
} from "./date-range-time-fields";

interface AddEditTimeModalProps {
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
  selectedDate?: Date | undefined;
  updateAvailableTime: GetMyAvailableTimesDTO | null;
  allKindergartens: KindergartenDto[];
}

const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

function splitDateTime(dateTime: string | Date): DateTimeValue {
  const date = new Date(dateTime);

  return {
    date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
    time: `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`,
  };
}

function hasDateTimeChanged(current: DateTimeValue, original: string): boolean {
  const previous = splitDateTime(original);

  return (
    current.date.toDateString() !== previous.date.toDateString() ||
    current.time !== previous.time
  );
}

function toIsoDateTime(dateTime: DateTimeValue) {
  const [hours, minutes] = dateTime.time.split(":").map(Number);

  const date = new Date(dateTime.date);
  date.setHours(hours, minutes, 0, 0);

  return date.toISOString();
}

const dateTimeSchema = z.object({
  date: z.date(),
  time: z.string().regex(TIME_REGEX, "Ange en giltig tid"),
});

const formSchema = z
  .object({
    StartDateTime: dateTimeSchema,
    EndDateTime: dateTimeSchema,
    kindergartens: z.array(z.string()).min(1, "Välj minst en förskola"),
  })
  .refine(
    (data) =>
      new Date(toIsoDateTime(data.StartDateTime)) <
      new Date(toIsoDateTime(data.EndDateTime)),
    {
      message: "Sluttiden måste vara efter starttiden",
      path: ["EndDateTime"],
    },
  );

type FormSchemaValues = z.infer<typeof formSchema>;

function getInitialValues(
  updateAvailableTime: GetMyAvailableTimesDTO | null,
  selectedDate: Date | undefined,
): FormSchemaValues {
  if (updateAvailableTime) {
    return {
      StartDateTime: splitDateTime(updateAvailableTime.startTime),
      EndDateTime: splitDateTime(updateAvailableTime.endTime),
      kindergartens: updateAvailableTime.kindergartens.map((k) => k.id),
    };
  }

  const { date } = splitDateTime(selectedDate ?? new Date());

  return {
    StartDateTime: { date, time: "08:00" },
    EndDateTime: { date, time: "16:00" },
    kindergartens: [],
  };
}

export default function AddEditTimeModal({
  open,
  setOpen,
  ...props
}: AddEditTimeModalProps) {
  // Reset the form when the modal is opened or closed to ensure a fresh state each time
  const formKey = `${props.updateAvailableTime?.id ?? "new"}-${
    props.selectedDate?.getTime() ?? "none"
  }`;

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(e.valueOf())}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100dvh-2rem)] flex-col overflow-y-auto sm:max-w-md"
      >
        {open && (
          <AddEditTimeForm
            key={formKey}
            onClose={() => setOpen(false)}
            {...props}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

type AddEditTimeFormProps = Omit<AddEditTimeModalProps, "open" | "setOpen"> & {
  onClose: () => void;
};

function AddEditTimeForm({
  onClose,
  selectedDate,
  updateAvailableTime,
  allKindergartens: kindergartens,
}: AddEditTimeFormProps) {
  const form = useForm<FormSchemaValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: getInitialValues(updateAvailableTime, selectedDate),
  });

  const {
    control,
    setValue,
    formState: { errors },
  } = form;

  const startDateTime = useWatch({ control, name: "StartDateTime" });
  const endDateTime = useWatch({ control, name: "EndDateTime" });

  const postService = AddAvailableTime();
  const editService = EditAvailableTime();

  function onSubmit(data: FormSchemaValues) {
    if (updateAvailableTime) {
      // Check if any of the fields have changed
      const hasStartTimeChanged = hasDateTimeChanged(
        data.StartDateTime,
        updateAvailableTime.startTime,
      );

      const hasEndTimeChanged = hasDateTimeChanged(
        data.EndDateTime,
        updateAvailableTime.endTime,
      );

      const hasKindergartensChanged =
        data.kindergartens.length !==
          updateAvailableTime.kindergartens.length ||
        !data.kindergartens.every((id) =>
          updateAvailableTime.kindergartens.some((k) => k.id === id),
        );

      // If none of the fields have changed, close the modal and return
      if (
        !hasStartTimeChanged &&
        !hasEndTimeChanged &&
        !hasKindergartensChanged
      ) {
        onClose();
        return;
      }

      editService.mutate({
        req: {
          startTime: hasStartTimeChanged
            ? toIsoDateTime(data.StartDateTime)
            : null,
          endTime: hasEndTimeChanged ? toIsoDateTime(data.EndDateTime) : null,
          kindergartens: hasKindergartensChanged ? data.kindergartens : null,
        },
        availableTimeId: updateAvailableTime.id,
      });
      onClose();
      return;
    }

    postService.mutate({
      startTime: toIsoDateTime(data.StartDateTime),
      endTime: toIsoDateTime(data.EndDateTime),
      kindergartens: data.kindergartens,
    });

    onClose();
  }

  return (
    <form
      className="flex flex-col gap-4"
      id="add-availabletime-form"
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <DialogHeader className="flex flex-row items-center gap-0">
        <DialogTitle className="text-center mx-auto">
          {updateAvailableTime
            ? "Ändra din tid"
            : "Lägg till en tillgänglig tid!"}
        </DialogTitle>
        <DialogClose
          render={
            <Button variant="ghost" className="m-0 p-0">
              <XIcon />
            </Button>
          }
        />
      </DialogHeader>
      <DateRangeTimeFields
        value={{ start: startDateTime, end: endDateTime }}
        onChange={({ start, end }) => {
          const options = { shouldDirty: true, shouldValidate: true };
          setValue("StartDateTime", start, options);
          setValue("EndDateTime", end, options);
        }}
        startError={errors.StartDateTime?.time ?? errors.StartDateTime}
        endError={errors.EndDateTime?.time ?? errors.EndDateTime}
      />
      <FieldGroup>
        <Controller
          name="kindergartens"
          control={control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-col items-center"
            >
              <FieldError errors={[fieldState.error]} />
              <SelectGroups {...field} KindergartenDto={kindergartens} />
            </Field>
          )}
        />
      </FieldGroup>
      <DialogFooter className="flex flex-row justify-between">
        <DialogClose render={<Button variant="outline">Avbryt</Button>} />
        <Button form="add-availabletime-form" type="submit">
          {updateAvailableTime ? "Ändra" : "Bekräfta"}
        </Button>
      </DialogFooter>
    </form>
  );
}
