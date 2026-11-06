import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api";
import type {
  BookDecidedTimeQuery,
  GetAllDecidedTimesResponse,
  PostPendingTimeRequest,
} from "../models";

type GetAllDecidedTimesParams = {
  kindergartenId?: string[];
  fromTime?: string;
  toTime?: string;
};

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
    }): Promise<GetAllDecidedTimesResponse | null> => {
      try {
        const response = await apiClient.get<GetAllDecidedTimesResponse>(
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

function PostPendingTime() {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (req: BookDecidedTimeQuery) => {
      return apiClient.post<PostPendingTimeRequest>("/api/pending-times", req);
    },

    onSuccess: async () => {
      await query.invalidateQueries({
        queryKey: ["pendingTimesData"],
      });
    },
  });
}

export { PostPendingTime, GetAllPendingTimes };
