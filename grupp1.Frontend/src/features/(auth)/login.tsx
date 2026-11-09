import { LoginForm } from "@/features/(auth)/-components/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/login")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <LoginForm className="w-1/2" />
    </div>
  );
}
