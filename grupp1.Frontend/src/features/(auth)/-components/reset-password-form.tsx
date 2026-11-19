import { cn } from "cn";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/shared/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { useResetPassword } from "../-api/ResetPasswordService";

const formSchema = z
  .object({
    password: z
      .string()
      .min(8, "Minst 8 tecken")
      .regex(/\d/, "Minst en siffra")
      .regex(/[a-z]/, "Minst en liten bokstav")
      .regex(/[A-Z]/, "Minst en stor bokstav")
      .regex(/[^A-Za-z0-9]/, "Minst ett specialtecken"),
    confirmPassword: z.string().min(1, "Bekräfta ditt lösenord"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Lösenorden matcher ej",
    path: ["confirmPassword"],
  });

type Props = React.ComponentProps<"div"> & {
  userId: string;
  token: string;
};

export function ResetPasswordForm({
  userId,
  token,
  className,
  ...props
}: Props) {
  const resetPassword = useResetPassword();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    resetPassword.mutate(
      { userId, token, newPassword: data.password },
      { onSuccess: () => navigate({ to: "/login" }) },
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-6 justify-center text-center",
        className,
      )}
      {...props}
    >
      <img
        className="w-28 self-center pb-6"
        src="/VicariaLogo-Compressed.png"
      />
      <h1 className="text-2xl">Välj ett nytt lösenord</h1>
      <Card className="ring-0">
        <CardHeader>
          <CardDescription>
            Skriv in ditt nya lösenord två gånger
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="reset-password-form"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="password">Nytt lösenord</FieldLabel>

                    <Input
                      {...field}
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                    />

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="confirmPassword"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="confirmPassword">
                      Bekräfta lösenord
                    </FieldLabel>
                    <Input
                      {...field}
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Button
                  type="submit"
                  form="reset-password-form"
                  disabled={resetPassword.isPending}
                >
                  {resetPassword.isPending ? "Sparar..." : "Byt lösenord"}
                </Button>
                {resetPassword.isError && (
                  <FieldError>
                    Länken är ogiltig eller har gått ut, eller så uppfyller
                    lösenordet inte kraven.
                  </FieldError>
                )}
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
