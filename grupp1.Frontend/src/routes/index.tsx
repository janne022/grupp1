import { useCurrentUser } from "@/api/services/MeService";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data, isPending, isError } = useCurrentUser();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Ruh roh, something went wrong!</div>;
  }

  if (data) {
    return <div>Hello {data.firstName}</div>;
  }
}
