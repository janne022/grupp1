import { SignupForm } from "@/components/signup-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <SignupForm className="w-1/2" />
    </div>
  );
}
