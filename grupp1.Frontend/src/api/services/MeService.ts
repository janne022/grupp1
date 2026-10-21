import { apiClient, ApiError } from "@/lib/api";
import type { UserInfoResponse } from "../models";
import { useQuery } from "@tanstack/react-query";

export const currentUserQuery = {
  queryKey: ["currentUser"] as const,

  queryFn: async ({
    signal,
  }: {
    signal: AbortSignal;
  }): Promise<UserInfoResponse | null> => {
    try {
      const response = await apiClient.get<UserInfoResponse>("/api/userinfo", {
        signal,
      });

      return response;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        return null;
      }

      throw error;
    }
  },
};

export function useCurrentUser() {
  return useQuery({ ...currentUserQuery, retry: false, staleTime: 13376969 });
}
