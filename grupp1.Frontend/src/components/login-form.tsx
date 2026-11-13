import { cn } from "cn";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/api/services/LoginService";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { currentUserQuery } from "@/api/services/MeService";
import { useState } from "react";
import NoAccountModal from "./ui/noAccountModal";

const formSchema = z.object({
  email: z.email("Ange en giltig e-postadress"),
  password: z.string().min(1, "Ange ditt lösenord"), //the 1 makes sure the usr has typed anything inte password field at all
});

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const login = useLogin();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [noAccountOpen, setNoAccountOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    login.mutate(
      {
        email: data.email,
        password: data.password,
      },
      {
        onSuccess: async () => {
          await queryClient.query({ ...currentUserQuery, staleTime: 0 });
          navigate({ to: "/" });
        },
      },
    );
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="ring-0">
        <CardHeader>
          {/* <CardTitle className="font-bold text-2xl">Login</CardTitle> */}
          <CardDescription>
            skriv ner konto detaljer för att logga in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="login-form"
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Lösenord</FieldLabel>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Glömt lösenord?
                      </a>
                    </div>
                    <Input
                      {...field}
                      id="password"
                      type="password"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                {login.isError && 
                <FieldError>Fel lösenord eller email</FieldError>}
                <Button type="submit" form="login-form">
                  Logga in
                </Button>
                <FieldDescription className="text-center">
                  <button
                    type="button"
                    onClick={() => setNoAccountOpen(true)}
                    className="underline-offset-4 hover:underline"
                  >
                    Har du inte ett konto?
                  </button>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <NoAccountModal open={noAccountOpen} setOpen={setNoAccountOpen} />
    </div>
  );
}
