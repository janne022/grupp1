import { apiClient, ApiError } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { UserInfoResponse } from "../models";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],

    queryFn: async ({ signal }) => {
      try {

        const response = await apiClient.get<UserInfoResponse>("/api/userinfo", { signal })

        return response

      } catch (error) {

        if (error instanceof ApiError && error.status === 401) {

          return null

        }

        throw error

      }
    },

    staleTime : 1337420
  });
}
