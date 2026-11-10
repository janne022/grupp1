import { createFileRoute } from "@tanstack/react-router";
import PendingMessage from "./-components/message";
import { GetAllPendingTimes } from "./-api/PendingTimeService";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";

export const Route = createFileRoute("/inbox/")({
  component: RouteComponent,
});

function RouteComponent() {
  const pendingTimesResponse = GetAllPendingTimes();

  if (pendingTimesResponse.isError) {
    return <h1>Oops, något gick fel!</h1>;
  }

  if (pendingTimesResponse.isLoading) {
    return <h1>Laddar in dina tidserbjudanden..</h1>;
  }

  if (pendingTimesResponse.isSuccess) {
    const pendingTimes = pendingTimesResponse.data?.pendingTimes;

    return (
      <div>
        <div className="flex justify-between">
          <h1>Dina erbjudna pass</h1>
          <Badge>3 pass</Badge>
        </div>
        <div>
          <Button>tab 1</Button>
          <Button>tab 2</Button>
          <Button>tab 3</Button>
        </div>
        {pendingTimes?.map((pendingTime) => (
          <PendingMessage pendingTime={pendingTime}/>
        ))}
      </div>
    );
  }
}
