import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/shared/api/api";
import type { GetPendingTimesResponse } from "@/shared/api/models";

type GetAllDecidedTimesParams = {
  kindergartenId?: string[];
  fromTime?: string;
  toTime?: string;
};

function RejectPendingTime() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: (pendingTimeId: string) => {
      return apiClient.delete<void>(
        `/api/pending-times/${pendingTimeId}/substitute`,
      );
    },

    onSuccess: async () => {
      await query.invalidateQueries({
        queryKey: ["pendingTimesData"],
      });
    },
  });
}

function GetAllPendingTimes(
  params: GetAllDecidedTimesParams = {},
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
