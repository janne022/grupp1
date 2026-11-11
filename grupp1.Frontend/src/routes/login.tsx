import { currentUserQuery } from "@/api/services/MeService";
import { LoginForm } from "@/components/login-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  staticData: { hideSidebar: true, hideFooter: true },
  component: RouteComponent,
  beforeLoad: async ({context }) => {
    const user = await context.queryClient.query(currentUserQuery)

    if(user) {
      throw Route.redirect({
        to: "/"
      })
    }
  }
});

function RouteComponent() {

  return (
    <div className="flex justify-center mt-26 c">
      <div className="text-center">
        <img className="w-28 justify-self-center pb-10" src="../../public/VicariaLogo-Compressed.png"></img>
        <p className="text-2xl">Welcome back!</p>
        <LoginForm className="min-w-xs max-w-xl" />
      </div>
    </div>
  );
}
