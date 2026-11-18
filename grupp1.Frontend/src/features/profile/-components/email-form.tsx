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

const emailSchema = z.object({
  email: z.email("Ange en giltig e-postadress"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export function EmailForm({ email }: EmailFormValues) {
  const [editing, setEditing] = useState(false);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email },
  });

  function toggle() {
    if (editing) {
      form.reset();
    }
    setEditing((prev) => !prev);
  }

  function onSubmit(data: EmailFormValues) {
    if (!form.formState.isDirty) {
      setEditing(false);
      return;
    }

    // TODO: Send data to the email endpoint, and move the lines below into its onSuccess
    form.reset(data);
    setEditing(false);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">E-postadress</FieldLabel>
              <div className="flex items-center gap-2">
                <Input
                  {...field}
                  id="email"
                  type="email"
                  autoComplete="email"
                  disabled={!editing}
                />
                <EditToggleButton
                  unlocked={editing}
                  onClick={toggle}
                  label="e-postadress"
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {editing && (
          <Button type="submit" className="self-end">
            Spara
          </Button>
        )}
      </FieldGroup>
    </form>
  );
}
