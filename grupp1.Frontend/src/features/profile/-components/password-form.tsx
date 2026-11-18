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
import { useChangePassword } from "../-api/ProfileService";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Ange ditt nuvarande lösenord."),
    newPassword: z
      .string()
      .min(8, "Lösenordet måste innehålla minst 8 tecken."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Lösenorden matchar inte.",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

const emptyPasswords: PasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const passwordFields = [
  {
    name: "currentPassword",
    label: "Nuvarande lösenord",
    autoComplete: "current-password",
  },
  { name: "newPassword", label: "Nytt lösenord", autoComplete: "new-password" },
  {
    name: "confirmPassword",
    label: "Bekräfta nytt lösenord",
    autoComplete: "new-password",
  },
] as const;

export function PasswordForm() {
  const [unlocked, setUnlocked] = useState(false);
  const changePassword = useChangePassword();
  const [changed, setChanged] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: emptyPasswords,
  });

  function toggle() {
    setChanged(false);
    if (unlocked) {
      form.reset(emptyPasswords);
    }
    setUnlocked((prev) => !prev);
  }

  function onSubmit(data: PasswordFormValues) {
    changePassword.mutate(
      { oldPassword: data.currentPassword, newPassword: data.newPassword },
      {
        onSuccess: () => {
          form.reset(emptyPasswords);
          setUnlocked(false);
          setChanged(true);
        },
        onError: () => {
          form.setError("root", {
            message:
              "Lösenordsbytet misslyckades. Kontrollera att ditt lösenord är minst 8 " +
              "tecken långt, innehåller både gemener och versaler, samt specialtecken.",
          });
        },
      },
    );
  }

  if (!unlocked) {
    return (
      <Field>
        <FieldLabel htmlFor="password-locked">Lösenord</FieldLabel>
        <div className="flex items-center gap-2">
          <Input id="password-locked" placeholder="••••••••" disabled />
          <EditToggleButton
            unlocked={false}
            onClick={toggle}
            label="lösenord"
          />
          {changed && (
            <p className="text-sm text-muted-foreground">
              Du kan nu använda ditt nya lösenord!
            </p>
          )}
        </div>
      </Field>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        {passwordFields.map(({ name, label, autoComplete }, index) => (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={name}>{label}</FieldLabel>
                <div className="flex items-center gap-2">
                  <Input
                    {...field}
                    id={name}
                    type="password"
                    autoComplete={autoComplete}
                  />
                  {index === 0 ? (
                    <EditToggleButton
                      unlocked
                      onClick={toggle}
                      label="lösenord"
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
        <Button
          type="submit"
          className="self-end"
          disabled={changePassword.isPending}
        >
          Byt lösenord
        </Button>
      </FieldGroup>
    </form>
  );
}
