import { apiClient } from "@/lib/api";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { LoginRequest } from "../models";

export function useLogin() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) =>
      apiClient.post<void>("/api/login", credentials),

    onSuccess: async () => {
      await query.cancelQueries();

      query.clear();

      // fetch new usah
    },
  });
}
