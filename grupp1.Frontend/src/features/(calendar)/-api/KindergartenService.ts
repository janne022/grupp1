import { useQuery } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/shared/api/api";
import type { GetAllKindergartensResponse } from "../../../api/models";

function GetAllKindergartens(enabled = true) {
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
    enabled: enabled,
  });
}

export { GetAllKindergartens };
