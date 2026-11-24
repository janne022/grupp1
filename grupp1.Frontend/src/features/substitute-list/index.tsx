import { createFileRoute } from "@tanstack/react-router";
import { useGetAllSubstitutes } from "./-api/SubstituteService";
import SubstituteCard from "./-components/substituteCard";
import { currentUserQuery } from "@/shared/services/MeService";

export const Route = createFileRoute("/substituteList/")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.query(currentUserQuery);

    if (!user?.roles.includes("Manager")) {
        throw Route.redirect({to: "/"})
    }
  },
});

function RouteComponent() {
  const { data, isLoading, isError } = useGetAllSubstitutes();

  if (isLoading) return <p>Laddar vikarier...</p>;
  if (isError) return <p>Problem uppstod</p>;

  const substitutes = data?.allSubstitutes ?? [];

  if (substitutes.length === 0) return <p>Inga vikarier hittades.</p>;

  return (
    <>
      <div className="p-3">
        <h1 className="text-2xl mb-5">Alla Vikarier i systemet</h1>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-3">
          {substitutes.map((s) => (
            <SubstituteCard
              key={s.substituteId}
              firstName={s.firstName}
              lastName={s.lastName}
              phoneNumber={s.phoneNumber}
              email={s.email}
            />
          ))}
        </div>
      </div>
    </>
  );
}
