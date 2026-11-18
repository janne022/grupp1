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

    const matchesSearchAndFilters = (
      time: { kindergartenName: string; startTime: string; endTime: string },
      searchQuery: string,
      filterState: typeof filterPendingState,
    ) => {
      const start = new Date(time.startTime);
      const end = new Date(time.endTime);
      const query = searchQuery.toLowerCase();

      const matchesSearch =
        time.kindergartenName.toLowerCase().includes(query) ||
        formatTime(time.startTime).includes(query) ||
        formatTime(time.endTime).includes(query) ||
        start
          .toLocaleDateString("sv-SE", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })
          .includes(query);

      const hours = countTimeDifference(start, end).hours;

      const matchesFilters =
        (!filterState.fullDay || hours >= 7) &&
        (!filterState.halfDay || hours < 7) &&
        (!filterState.thisWeek || isSameISOWeek(new Date(), start));

      return matchesSearch && matchesFilters;
    };

    const visiblePendingTimes = pendingTimesList.filter((pendingTime) =>
      matchesSearchAndFilters(
        {
          kindergartenName: pendingTime.kindergarten.name,
          startTime: pendingTime.startTime,
          endTime: pendingTime.endTime,
        },
        searchPendingQuery,
        filterPendingState,
      ),
    );

    const visibleDecidedTimes = decidedTimesList.filter((decidedTime) =>
      matchesSearchAndFilters(
        decidedTime,
        searchDecidedQuery,
        filterDecidedState,
      ),
    );

    return (
      <Tabs
        defaultValue="pending"
        className="p-3 h-[calc(100dvh-5rem)] md:h-dvh"
      >
        <TabsList variant="line">
          <TabsTrigger value="pending">Tillgängliga pass</TabsTrigger>
          <TabsTrigger value="decided">Övriga</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="flex flex-col min-h-0">
          <div className="flex flex-col flex-1 min-h-0">
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
            <div className="flex-1 min-h-0 overflow-y-auto p-0.5">
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
        <TabsContent value="decided" className="flex flex-col min-h-0">
          <div className="flex flex-col flex-1 min-h-0">
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
            <div className="flex-1 min-h-0 overflow-y-auto p-0.5">
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
