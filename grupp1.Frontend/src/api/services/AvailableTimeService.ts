import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api";
import type {
  GetMyAvailableTimesResponse,
  PostAvailableTimeRequest,
  PostAvailableTimeResponse,
  UpdateAvailableTimeQuery,
  UpdateAvailableTimeResponse,
} from "../models";
import { useCurrentUser } from "./MeService";

function GetAllAvailableTimes(enabled = true) {

  const { data: user } = useCurrentUser();
  const userId = user?.id;
  
  return useQuery({
    queryKey: ["availableTimesData"],
    queryFn: async ({
      signal,
    }: {
      signal: AbortSignal;
    }): Promise<GetMyAvailableTimesResponse | null> => {
      try {
        const response = await apiClient.get<GetMyAvailableTimesResponse>(
          `/api/available-times/${userId}`,
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
    enabled: enabled,
  });
}

function AddAvailableTime() {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (req: PostAvailableTimeRequest) => {
      return apiClient.post<PostAvailableTimeResponse>(
        "/api/available-times",
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
      return apiClient.delete<void>(`/api/available-times/${id}`);
    },

    onSuccess: async () => {
      await query.invalidateQueries({
        queryKey: ["availableTimesData"],
      });
    },
  });
}

function EditAvailableTime() {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (req: UpdateAvailableTimeQuery) => {
      return apiClient.patch<UpdateAvailableTimeResponse>(
        `/api/available-times/${req.availableTimeId}`,
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

export {
  GetAllAvailableTimes,
  AddAvailableTime,
  DeleteAvailableTime,
  EditAvailableTime,
};
