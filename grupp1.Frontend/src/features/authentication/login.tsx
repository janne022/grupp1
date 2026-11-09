import { LoginForm } from "@/features/authentication/-components/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/authentication/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <LoginForm className="w-1/2" />
    </div>
  );
}
