import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/shared/api/api";
import type {
  AcceptPendingTimeResponse,
  GetPendingTimesResponse,
} from "@/shared/api/models";

type GetAllPendingTimesParams = {
  fromTime?: string;
  toTime?: string;
  includeBookedTimes?: boolean;
};

function AcceptPendingTime() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: (pendingTimeId: string) => {
      return apiClient.post<AcceptPendingTimeResponse>(
        `/api/decided-times/${pendingTimeId}`,
      );
    },

    onSuccess: async () => {
      await query.invalidateQueries({ queryKey: ["pendingTimesData"] });
      // TODO: also invalidate decided time queries here I think?
    },
  });
}

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

export { GetAllPendingTimes, RejectPendingTime, AcceptPendingTime };
