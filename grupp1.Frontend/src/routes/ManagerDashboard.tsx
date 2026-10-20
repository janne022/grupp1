import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ManagerDashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <main className="w-full flex flex-col items-center border">
        <section className="border flex flex-col md:flex-row gap-4">
          <h2 className="border border-blue-500 w-[20rem] h-[20rem]">.</h2>
          <h2 className="border border-red-500 w-[20rem] h-[20rem]">.</h2>
        </section>

        <section></section>
      </main>
    </>
  );
}
