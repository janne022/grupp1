import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api";
import type {
  BookDecidedTimeQuery,
  BookDecidedTimeResponse,
  EditDecidedTimeRequest,
  EditDecidedTimeResponse,
  GetAllDecidedTimesResponse,
} from "../models";

type GetAllDecidedTimesParams = {
  kindergartenId?: string[];
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

function AddDecidedTime() {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (req: BookDecidedTimeQuery) => {
      return apiClient.post<BookDecidedTimeResponse>("/api/decided-times", req);
    },

    onSuccess: async () => {
      await query.invalidateQueries({
        queryKey: ["decidedTimesData"],
      });
    },
  });
}

function DeleteDecidedTime() {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return apiClient.delete<void>(`/api/decided-times${id}`);
    },

    onSuccess: async () => {
      await query.invalidateQueries({
        queryKey: ["decidedTimesData"],
      });
    },
  });
}

function EditDecidedTime() {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (req: EditDecidedTimeRequest) => {
      return apiClient.patch<EditDecidedTimeResponse>("/api/decidedtimes", req);
    },

    onSuccess: async () => {
      await query.invalidateQueries({
        queryKey: ["decidedTimesData"],
      });
    },
  });
}

export {
  GetAllDecidedTimes,
  AddDecidedTime,
  DeleteDecidedTime,
  EditDecidedTime,
};
