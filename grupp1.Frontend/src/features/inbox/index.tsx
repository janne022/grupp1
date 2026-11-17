import { createFileRoute } from "@tanstack/react-router";
import PendingMessage from "./-components/pendingMessage";
import { GetAllPendingTimes } from "./-api/PendingTimeService";
import { GetAllDecidedTimes } from "./-api/DecidedTimeService";
import { Badge } from "@/shared/components/ui/badge";
import { isSameISOWeek } from "date-fns";
import { useState } from "react";
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

  const [searchPendingQuery, setSearchPendingQuery] = useState("");
  const [searchDecidedQuery, setSearchDecidedQuery] = useState("");
  const [filterPendingState, setFilterPendingState] = useState({
    fullDay: false,
    halfDay: false,
    thisWeek: false,
  });
  const [filterDecidedState, setFilterDecidedState] = useState({
    fullDay: false,
    halfDay: false,
    thisWeek: false,
  });

  const decidedTimesResponse = GetAllDecidedTimes({});

  const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString("sv-SE", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const countTimeDifference = (start: Date, end: Date) => {
    const difference = Math.abs(end.getTime() - start.getTime());

    console.log(Math.floor(difference / 3600000));

    return {
      milliseconds: difference,
      seconds: Math.floor(difference / 1000),
      minutes: Math.floor(difference / 60000),
      hours: Math.floor(difference / 3600000),
      days: Math.floor(difference / 86400000),
    };
  };

  if (pendingTimesResponse.isError || decidedTimesResponse.isError) {
    return <h1>Oops, något gick fel!</h1>;
  }

  if (pendingTimesResponse.isLoading || decidedTimesResponse.isLoading) {
    return <h1>Laddar in dina pass..</h1>;
  }

  if (pendingTimesResponse.isSuccess && decidedTimesResponse.isSuccess) {
    const pendingTimesList = pendingTimesResponse.data?.pendingTimes ?? [];
    const decidedTimesList = decidedTimesResponse.data?.decidedTimes ?? [];

    const visiblePendingTimes = pendingTimesList.filter(
      (pendingTime) =>
        pendingTime.kindergarten.name
          .toLowerCase()
          .includes(searchPendingQuery.toLowerCase()) ||
        formatTime(pendingTime.startTime).includes(searchPendingQuery) ||
        formatTime(pendingTime.endTime).includes(searchPendingQuery) ||
        (new Date(pendingTime.startTime)
          .toLocaleDateString("sv-SE", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })
          .includes(searchPendingQuery) &&
          (!filterPendingState.fullDay ||
            countTimeDifference(
              new Date(pendingTime.startTime),
              new Date(pendingTime.endTime),
            ).hours >= 7)

            &&


          (!filterPendingState.halfDay ||
            countTimeDifference(
              new Date(pendingTime.startTime),
              new Date(pendingTime.endTime),
            ).hours < 7) &&
          (!filterPendingState.thisWeek ||
            isSameISOWeek(new Date(), new Date(pendingTime.startTime)))),
    );

    const visibleDecidedTimes = decidedTimesList.filter((decidedTime) =>
      decidedTime.kindergartenName
        .toLowerCase()
        .includes(searchDecidedQuery.toLowerCase()),
    );

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
                    {visiblePendingTimes?.length} pass i listan
                  </Badge>
                </div>
                <HeaderBar
                  filterState={filterPendingState}
                  filterSetter={setFilterPendingState}
                  searchState={searchPendingQuery}
                  searchSetter={setSearchPendingQuery}
                />
              </div>
            </div>
            <div className="overflow-y-scroll max-h-199 p-0.5">
              {visiblePendingTimes.length === 0 ? (
                <p>Inget pass matchade din sökning...</p>
              ) : (
                visiblePendingTimes?.map((pendingTime) => (
                  <PendingMessage
                    key={pendingTime.id}
                    pendingTime={pendingTime}
                  />
                ))
              )}
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
                    {visibleDecidedTimes?.length} pass i listan
                  </Badge>
                </div>
                <HeaderBar
                  filterState={filterDecidedState}
                  filterSetter={setFilterDecidedState}
                  searchState={searchDecidedQuery}
                  searchSetter={setSearchDecidedQuery}
                />
              </div>
            </div>
            <div className="overflow-y-scroll max-h-199 p-0.5">
              {visibleDecidedTimes?.map((decidedTime) => (
                <DecidedMessage
                  key={decidedTime.decidedTimeId}
                  decidedTime={decidedTime}
                />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    );
  }
}
