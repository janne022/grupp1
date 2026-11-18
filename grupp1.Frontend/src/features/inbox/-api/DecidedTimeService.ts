import { apiClient, ApiError } from "@/shared/api/api";
import type { GetAllDecidedTimesResponse } from "@/shared/api/models";
import { useQuery } from "@tanstack/react-query";

type GetAllDecidedTimesParams = {
  kindergartensIds?: string[];
  fromTime?: string;
  toTime?: string;
};

function GetAllDecidedTimes(
  params: GetAllDecidedTimesParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: ["decidedTimesData", params],
    queryFn: async ({
      signal,
    }: {
      signal: AbortSignal;
    }): Promise<GetAllDecidedTimesResponse | null> => {
      try {
        const response = await apiClient.get<GetAllDecidedTimesResponse>(
          "/api/decided-times",
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

export { GetAllDecidedTimes };
