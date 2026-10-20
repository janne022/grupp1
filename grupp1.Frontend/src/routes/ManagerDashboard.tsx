import { createFileRoute } from "@tanstack/react-router";
import CalendarComponent from "@/components/CalenderComponent";

export const Route = createFileRoute("/ManagerDashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <main className="w-full flex flex-col items-center border">
        <h1 className="text-3xl">Översikt</h1>
        <section className="border w-full flex flex-row">
          <div className="md: border w-1/2">
            <CalendarComponent />
          </div>
          <div className="md: border w-1/2">BookingList</div>
        </section>

        <section className="border w-full flex flex-row">
          <div className="h-[10rem] md: border w-1/2"></div>
          <div className="md: border w-1/2"></div>
        </section>
      </main>
    </>
  );
}
