import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/shared/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { EditToggleButton } from "@/shared/components/ui/edit-toggle-button";
import { useChangeNames } from "@/features/profile/-api/ProfileService";

const nameSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "Du måste fylla i ett förnamn.")
    .max(200, "Ditt förnamn får inte innehålla fler än 200 tecken."),
  lastName: z
    .string()
    .trim()
    .min(1, "Du måste fylla i ett efternamn.")
    .max(200, "Ditt efternamn får inte innehålla fler än 200 tecken."),
});

type NameFormValues = z.infer<typeof nameSchema>;

const fields = [
  { name: "firstName", label: "Förnamn" },
  { name: "lastName", label: "Efternamn" },
] as const;

export function NameForm({ firstName, lastName }: NameFormValues) {
  const [editing, setEditing] = useState(false);
  const changeNames = useChangeNames();

  const form = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { firstName, lastName },
  });

  const { isDirty, dirtyFields } = form.formState;

  function toggle() {
    if (editing) {
      form.reset();
    }
    setEditing((prev) => !prev);
  }

  function onSubmit(data: NameFormValues) {
    if (!isDirty) {
      setEditing(false);
      return;
    }

    changeNames.mutate(
      {
        newFirstName: dirtyFields.firstName ? data.firstName : null,
        newLastName: dirtyFields.lastName ? data.lastName : null,
      },
      {
        onSuccess: () => {
          form.reset(data);
          setEditing(false);
        },
        onError: () => {
          form.setError("root", {
            message: "Namnsparning misslyckades. Försök gärna igen.",
          });
        },
      },
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {fields.map(({ name, label }, index) => (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={name}>{label}</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input {...field} id={name} disabled={!editing} />
                  {index === 0 ? (
                    <EditToggleButton
                      unlocked={editing}
                      onClick={toggle}
                      label="namn"
                    />
                  ) : (
                    <div className="size-9 shrink-0" aria-hidden />
                  )}
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        ))}

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        {editing && (
          <Button
            type="submit"
            className="self-end"
            disabled={changeNames.isPending}
          >
            Spara
          </Button>
        )}
      </FieldGroup>
    </form>
  );
}
