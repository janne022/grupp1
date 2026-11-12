import { createFileRoute } from "@tanstack/react-router";
import PendingMessage from "./-components/message";
import { GetAllPendingTimes } from "./-api/PendingTimeService";
import { Badge } from "@/shared/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import HeaderBar from "./-components/headerBar";

export const Route = createFileRoute("/inbox/")({
  component: RouteComponent,
});

function RouteComponent() {
  const pendingTimesResponse = GetAllPendingTimes({
    includeBookedTimes: false,
  });

  if (pendingTimesResponse.isError) {
    return <h1>Oops, något gick fel!</h1>;
  }

  if (pendingTimesResponse.isLoading) {
    return <h1>Laddar in dina tidserbjudanden..</h1>;
  }

  if (pendingTimesResponse.isSuccess) {
    const pendingTimes = pendingTimesResponse.data?.pendingTimes;

    return (
      <Tabs defaultValue="pending" className="p-3">
        <TabsList variant="line">
          <TabsTrigger value="pending">Tillgängliga pass</TabsTrigger>
          <TabsTrigger value="decided">Övriga</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <div>
            <div className="flex flex-col gap-3">
              <div className="pb-2 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl">
                    Pass som matchar dina tillgängliga tider
                  </h1>
                  <Badge className="p-3" variant="secondary">
                    {pendingTimes?.length} pass i listan
                  </Badge>
                </div>
                <HeaderBar />
              </div>
            </div>
            <div className="overflow-y-scroll max-h-199 p-0.5">
              {pendingTimes?.map((pendingTime) => (
                <PendingMessage pendingTime={pendingTime} />
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="decided">
          <p>Här var det tomt..!</p>
        </TabsContent>
      </Tabs>
    );
  }
}
