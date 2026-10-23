import { useId } from "react";
import { Field, FieldLabel } from "./field";
import { Input } from "./input";

interface TimePickerProp {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function TimePicker({ label, value, onChange }: TimePickerProp) {
  const id = useId(); // both pickers previously shared the same id

  return (
    <Field className="w-20">
      <FieldLabel htmlFor={id} className="w-full justify-center">
        {label}
      </FieldLabel>
      <Input
        id={id}
        min="06:00"
        max="18:00"
        type="time"
        step="60"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
    </Field>
  );
}
