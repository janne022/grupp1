import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { GetAllAvailableTimeByManagerResponse } from "../models";

export const availableTimesByManagerQuery = {
  queryKey: ["availableTimes", "byManager"] as const,
  queryFn: ({ signal }: {
    signal: AbortSignal
  }): Promise<GetAllAvailableTimeByManagerResponse> => {
    return apiClient.get<GetAllAvailableTimeByManagerResponse>("/api/availabletimes/bymanager", {
      signal
    });
  }
}
export function useAvailableTimesByManager() {
  return useQuery(availableTimesByManagerQuery);
}