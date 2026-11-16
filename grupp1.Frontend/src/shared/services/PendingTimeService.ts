import { useQuery } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/shared/api/api";
import type {
  GetPendingTimesResponse,
} from "@/shared/api/models";

type GetAllPendingTimesParams = {
  fromTime?: string;
  toTime?: string;
  includeBookedTimes?: boolean;
};

function GetAllPendingTimes(
  params: GetAllPendingTimesParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ["pendingTimesData", params],
    queryFn: async ({
      signal,
    }: {
      signal: AbortSignal;
    }): Promise<GetPendingTimesResponse | null> => {
      try {
        const response = await apiClient.get<GetPendingTimesResponse>(
          "/api/pending-times",
          {
            signal,
            params,
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
    enabled: enabled,
  });
}

export { GetAllPendingTimes };
