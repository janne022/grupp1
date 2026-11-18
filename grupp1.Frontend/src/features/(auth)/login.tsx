import { currentUserQuery } from "@/shared/services/MeService";
import { LoginForm } from "@/features/(auth)/-components/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/login")({
  staticData: { hideSidebar: true, hideFooter: true },
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.query(currentUserQuery);

    if (user) {
      throw Route.redirect({
        to: "/",
      });
    }
  },
});

function RouteComponent() {
  return (
    <div className="flex justify-center pt-26 c">
      <LoginForm className="min-w-xs max-w-xl" />
    </div>
  );
}
