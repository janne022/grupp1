import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { GetAllAvailableTimeByManagerResponse } from "../models";

export const availableTimesByManagerQuery = {
  queryKey: ["availableTimes", "byManager"] as const,
  staleTime: 1,
  gcTime: 1,
  retry: false,
  queryFn: ({
    signal,
  }: {
    signal: AbortSignal;
  }): Promise<GetAllAvailableTimeByManagerResponse> => {
    return apiClient.get<GetAllAvailableTimeByManagerResponse>(
      "/api/availabletimes/bymanager",
      {
        signal,
      },
    );
  },
};
export function useAvailableTimesByManager(enabled = true) {
  return useQuery({ ...availableTimesByManagerQuery, enabled });
}
