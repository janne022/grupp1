import { createFileRoute } from "@tanstack/react-router";
import CalendarComponent from "@/components/CalenderComponent";

export const Route = createFileRoute("/ManagerDashboard")({
  component: RouteComponent,
});

// TODO: Add BookingsList once its complete, and call for GetAllDecidedTimes
// TODO: Add delete-booking logic

function RouteComponent() {
  return (
    <>
      <main className="w-full p-4 md:p-6">
        <h1 className="mb-4 text-3xl">Översikt</h1>

        <div className="grid gap-4 md:grid-cols-4">
          <section className="rounded-2xl border md:p-4 md:col-span-2">
            <CalendarComponent />
          </section>

          <section className="rounded-2xl border h-[40rem] md:p-4 md:col-span-2">
            BookingList
          </section>

          <section className="rounded-2xl border md:p-4 md:col-span-2">
            Future component?
          </section>

          {/* Add more sections if needed */}
        </div>
      </main>
    </>
  );
}
