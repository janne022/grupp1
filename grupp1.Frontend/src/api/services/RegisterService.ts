import { apiClient } from "@/lib/api";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { RegisterQuery } from "../models";
import { currentUserQuery } from "./MeService";

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
