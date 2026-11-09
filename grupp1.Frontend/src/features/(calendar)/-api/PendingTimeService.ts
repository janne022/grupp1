import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/shared/api/api";
import type {
  GetAllDecidedTimesResponse,
  PostPendingTimeRequest,
  PostPendingTimeResponse,
} from "@/shared/api/models";

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
    mutationFn: (req: PostPendingTimeRequest) => {
      return apiClient.post<PostPendingTimeResponse>("/api/pending-times", req);
    },

    onSuccess: async () => {
      await query.invalidateQueries({
        queryKey: ["pendingTimesData"],
      });
    },
  });
}

export { PostPendingTime, GetAllPendingTimes };
