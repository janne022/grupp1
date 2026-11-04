import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api";
import type {
  BookDecidedTimeQuery,
  BookDecidedTimeResponse,
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
          "/api/decidedtime",
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
      return apiClient.post<BookDecidedTimeResponse>("/api/decidedtime", req);
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
      return apiClient.delete<void>(`/api/decidedtime/${id}`);
    },

    onSuccess: async () => {
      await query.invalidateQueries({
        queryKey: ["decidedTimesData"],
      });
    },
  });
}

// TODO: Change to valid type when backend is implemented
function EditDecidedTime() {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (req: BookDecidedTimeQuery) => {
      return apiClient.put<BookDecidedTimeResponse>("/api/decidedtime", req);
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
