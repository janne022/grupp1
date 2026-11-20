import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordForm } from "./-components/reset-password-form";

export const Route = createFileRoute("/(auth)/reset-password")({
  staticData: { hideSidebar: true, hideFooter: true },
  validateSearch: (search: Record<string, unknown>) => ({
    userId: String(search.userId ?? ""),
    token: String(search.token ?? ""),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { userId, token } = Route.useSearch();

  return (
    <div className="flex justify-center pt-26">
      <ResetPasswordForm
        userId={userId}
        token={token}
        className="min-w-xs max-w-xl"
      />
    </div>
  );
}
