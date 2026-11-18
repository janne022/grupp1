import { Navigate } from "@tanstack/react-router";
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

export function ProfilePage() {
  const { data: user, isPending, isError } = useCurrentUser();

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
    </div>
  );
}
