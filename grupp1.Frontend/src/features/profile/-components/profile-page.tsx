import { Navigate } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useCurrentUser } from "@/shared/services/MeService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { NameForm } from "@/features/profile/-components/name-form";
import { PasswordForm } from "@/features/profile/-components/password-form";
import { EmailForm } from "@/features/profile/-components/email-form";
import { useLogoutAndRedirectToLogin } from "@/features/(auth)/-api/LogoutService";

export function ProfilePage() {
  const { data: user, isPending, isError } = useCurrentUser();
  const { logoutAndRedirectToLogin, isPending: isLoggingOut } =
    useLogoutAndRedirectToLogin();

  if (isPending) {
    return <p className="p-4 text-muted-foreground">Var god vänta...</p>;
  }

  if (isError) {
    return <p className="p-4">Något gick fel när profilen skulle hämtas.</p>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="mx-auto w-full max-w-xl space-y-4 p-4">
      <h1 className="text-2xl font-semibold">Min profil</h1>

      <Card>
        <CardHeader>
          <CardTitle>Namn</CardTitle>
        </CardHeader>
        <CardContent>
          <NameForm
            firstName={user.firstName ?? ""}
            lastName={user.lastName ?? ""}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>E-post</CardTitle>
        </CardHeader>
        <CardContent>
          <EmailForm email={user.email ?? ""} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lösenord</CardTitle>
        </CardHeader>
        <CardContent>
          <PasswordForm />
        </CardContent>
      </Card>

      <Button
        variant="outline"
        className="w-full"
        onClick={logoutAndRedirectToLogin}
        disabled={isLoggingOut}
      >
        <LogOutIcon />
        Logga ut
      </Button>
    </div>
  );
}
