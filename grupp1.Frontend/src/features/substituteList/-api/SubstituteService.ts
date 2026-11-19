import { apiClient, ApiError } from "@/shared/api/api";
import type { AllSubstitutesResponse } from "@/shared/api/models";
import { useQuery } from "@tanstack/react-query";

function useGetAllSubstitutes(enabled = true) {
    return useQuery({
        queryKey: ["substitutesData"],
        queryFn: async ({ signal }): Promise<AllSubstitutesResponse | null> => {
            try {
                return await apiClient.get<AllSubstitutesResponse>(
                    "/api/account/all",
                    {
                         signal 
                    },
                );
            } catch (error) {
                if (error instanceof ApiError && error.status === 401) {
                    return null;
                }
                throw error;
            }
        },
        enabled,
    });
}

export { useGetAllSubstitutes };