"use client";

import * as React from "react";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { sv } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type dateTime = {
  date: Date;
  time: string;
};

type stateProps = {
  value: dateTime;
  onChange: (value: dateTime) => void;
};

export function DatePickerTime({
  labelName,
  value,
  onChange,
}: {
  labelName: string;
} & stateProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <FieldGroup className="mx-auto max-w-xs flex-row">
      <Field>
        <FieldLabel htmlFor="date-picker-optional">{labelName}</FieldLabel>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                id="date-picker-optional"
                className="w-32 justify-between font-normal"
              >
                { value?.date ? format(value.date, "PPP") : "Välj datum"}
                <ChevronDownIcon data-icon="inline-end" />
              </Button>
            }
          />
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={value.date}
              disabled={{ dayOfWeek: [0, 6] }}
              locale={sv}
              captionLayout="dropdown"
              defaultMonth={value.date}
              onSelect={(date) => {

                console.log("Date inside of ONSELECT!!!!",date)

                if (!date) {
                  return;
                }

                console.log("after iF statement: ", date)
                onChange({...value, date});
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </Field>
      <Field className="w-32">
        <FieldLabel htmlFor="time-picker-optional">Tid</FieldLabel>
        <Input
          min="06:00"
          max="18:00"
          type="time"
          id="time-picker-optional"
          step="60"
          onChange={(time) => {onChange({...value, time: time.target.value})}}
          value={value.time}
          className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </Field>
    </FieldGroup>
  );
}
