import { createFileRoute } from "@tanstack/react-router";
import PendingMessage from "./-components/pendingMessage";
import { GetAllPendingTimes } from "./-api/PendingTimeService";
import { GetAllDecidedTimes } from "./-api/DecidedTimeService";
import { Badge } from "@/shared/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import HeaderBar from "./-components/headerBar";
import DecidedMessage from "./-components/decidedMessage";

export const Route = createFileRoute("/inbox/")({
  component: RouteComponent,
});

function RouteComponent() {
  const pendingTimesResponse = GetAllPendingTimes({
    includeBookedTimes: false,
  });

  const decidedTimesResponse = GetAllDecidedTimes({});

  if (pendingTimesResponse.isError || decidedTimesResponse.isError) {
    return <h1>Oops, något gick fel!</h1>;
  }

  if (pendingTimesResponse.isLoading || decidedTimesResponse.isLoading) {
    return <h1>Laddar in dina pass..</h1>;
  }

  if (pendingTimesResponse.isSuccess && decidedTimesResponse.isSuccess) {
    const pendingTimes = pendingTimesResponse.data?.pendingTimes;
    const decidedTimes = decidedTimesResponse.data?.decidedTimes;

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
          <div>
            <div className="flex flex-col gap-3">
              <div className="pb-2 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl">Övriga pass</h1>
                  <Badge className="p-3" variant="secondary">
                    {decidedTimes?.length} pass i listan
                  </Badge>
                </div>
                <HeaderBar />
              </div>
            </div>
            <div className="overflow-y-scroll max-h-199 p-0.5">
              {decidedTimes?.map((decidedTime) => (
                <DecidedMessage decidedTime={decidedTime} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    );
  }
}
