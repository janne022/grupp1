import { useQuery } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api";
import type { GetAllKindergartensResponse } from "../models";

function GetAllKindergartens() {
  return useQuery({
    queryKey: ["kindergartensData"],
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60,

    refetchOnWindowFocus: true,

    queryFn: async ({
      signal,
    }: {
      signal: AbortSignal;
    }): Promise<GetAllKindergartensResponse | null> => {
      try {
        const response = await apiClient.get<GetAllKindergartensResponse>(
          "/api/kindergartens",
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

export { GetAllKindergartens };
