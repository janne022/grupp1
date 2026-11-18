import { createFileRoute } from "@tanstack/react-router";
import { SignupForm } from "./-components/signup-form";

export const Route = createFileRoute("/(auth)/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SignupForm className="w-1/2" />
    </div>
  );
}
