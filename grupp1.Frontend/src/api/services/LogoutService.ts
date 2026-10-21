import { apiClient } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { currentUserQuery } from "./MeService";
import type { UserInfoResponse } from "../models";

// Hook to log out a user. On success, the current user query is invalidated and refetched.
export function useLogout() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.post<void>("/api/logout"),

    onSuccess: async () => {
      await query.cancelQueries();

      query.clear();

      await query.query(currentUserQuery);
      query.setQueryData<UserInfoResponse | null>(["currentUser"], null);
    },
  });
}
