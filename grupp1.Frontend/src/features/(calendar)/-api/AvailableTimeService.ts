import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/shared/api/api";
import type {
  GetMyAvailableTimesResponse,
  PostAvailableTimeRequest,
  PostAvailableTimeResponse,
  UpdateAvailableTimeRequest,
  UpdateAvailableTimeResponse,
} from "@/shared/api/models";
import { useCurrentUser } from "../../../shared/services/MeService";

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
    mutationFn: ({
      req,
      availableTimeId,
    }: {
      req: UpdateAvailableTimeRequest;
      availableTimeId: string;
    }): Promise<UpdateAvailableTimeResponse> => {
      return apiClient.patch<UpdateAvailableTimeResponse>(
        `/api/available-times/${availableTimeId}`,
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
