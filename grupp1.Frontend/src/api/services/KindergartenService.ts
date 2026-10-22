import { useQuery } from "@tanstack/react-query";
import { apiClient, ApiError } from "@/lib/api";
import type { KindergartenDto } from "../models";

function GetAllKindergartens() {
  return useQuery({
    queryKey: ["kindergartensData"],
    queryFn: async ({
      signal,
    }: {
      signal: AbortSignal;
    }): Promise<KindergartenDto | null> => {
      try {
        const response = await apiClient.get<KindergartenDto>(
          "/api/kindergartens",
          {
            signal,
          },
        );
        console.log("Kindergarten response:", response.kindergartens);
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
