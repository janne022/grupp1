import { apiClient } from "@/shared/api/api";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { RegisterQuery } from "../../../api/models";
import { currentUserQuery } from "../../../shared/services/MeService";

// Hook to sign up a user. On success, the current user query is invalidated and refetched.
export function useSignup() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: (credentials: RegisterQuery) =>
      apiClient.post<void>("/api/auth/register", credentials),

    onSuccess: async () => {
      await query.cancelQueries();

      query.clear();

      await query.query(currentUserQuery);
    },
  });
}
