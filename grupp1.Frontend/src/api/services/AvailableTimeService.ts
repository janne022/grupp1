import { useQuery } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api";
import type { GetMyAvailableTimesResponse } from "../models";

function GetAllAvailableTimes() {
  return useQuery({
    queryKey: ["availableTimesData"],
    queryFn: async ({
      signal,
    }: {
      signal: AbortSignal;
    }): Promise<GetMyAvailableTimesResponse | null> => {
      try {
        const response = await apiClient.get<GetMyAvailableTimesResponse>(
          "/api/availabletimes",
          {
            signal,
          },
        );
        return response;
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          return null;
        }

        throw error;
      }
    },
  });
}
export { GetAllAvailableTimes };
