import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api";
import type {
  GetMyAvailableTimesResponse,
  PostAvailableTimeRequest,
  PostAvailableTimeResponse,
} from "../models";

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

function AddAvailableTime() {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (req: PostAvailableTimeRequest) => {
      return apiClient.post<PostAvailableTimeResponse>(
        "/api/availabletimes",
        req,
      );
    },

    onSuccess: async () => {
      await query.invalidateQueries({
        queryKey: ["availableTimesData"],
      });
    },
  });
}

function DeleteAvailableTime() {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return apiClient.delete<void>(`/api/availabletimes/${id}`);
    },

    onSuccess: async () => {
      await query.invalidateQueries({
        queryKey: ["availableTimesData"],
      });
    },
  });
}

export { GetAllAvailableTimes, AddAvailableTime, DeleteAvailableTime };
