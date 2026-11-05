import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { GetAllAvailableTimeByManagerResponse } from "../models";
import { useCurrentUser } from "./MeService";

export const availableTimesByManagerQuery = (managerId: string) => ({
  queryKey: ["availableTimes", "byManager"] as const,
  staleTime: 1000 * 60 * 5,
  gcTime: 1000 * 60 * 10,
  retry: false,
  queryFn: ({
    signal,
  }: {
    signal: AbortSignal;
  }): Promise<GetAllAvailableTimeByManagerResponse> => {
    return apiClient.get<GetAllAvailableTimeByManagerResponse>(
      `/api/managers/${managerId}/available-times`,
      {
        signal,
      },
    );
  },
});
export function useAvailableTimesByManager(enabled = true) {
  const { data: user } = useCurrentUser();
  const managerId = user?.id;

  return useQuery({
    ...availableTimesByManagerQuery(managerId!),
    enabled: enabled && !!managerId,
  });
}
