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
import { useChangeEmail } from "@/features/profile/-api/ProfileService";

const emailSchema = z.object({
  email: z.email("Ange en giltig e-postadress."),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export function EmailForm({ email }: EmailFormValues) {
  const [editing, setEditing] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const changeEmail = useChangeEmail();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email },
  });

  const { isDirty } = form.formState;

  function toggle() {
    setSentTo(null);
    if (editing) {
      form.reset();
    }
    setEditing((prev) => !prev);
  }

  function onSubmit(data: EmailFormValues) {
    if (!isDirty) {
      setEditing(false);
      return;
    }

    changeEmail.mutate(
      { newEmail: data.email },
      {
        onSuccess: () => {
          form.reset();
          setEditing(false);
          setSentTo(data.email);
        },
        onError: () => {
          form.setError("root", {
            message: "E-postadressändringen misslyckades. Försök gärna igen.",
          });
        },
      },
    );
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
              {sentTo && (
                <p className="text-sm text-muted-foreground">
                  Vi har skickat en bekräftelselänk till {sentTo}. Adressen
                  ändras när du klickat på länken.
                </p>
              )}
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-destructive">
            {form.formState.errors.root.message}
          </p>
        )}
        {editing && (
          <Button
            type="submit"
            className="self-end"
            disabled={changeEmail.isPending}
          >
            Spara
          </Button>
        )}
      </FieldGroup>
    </form>
  );
}
