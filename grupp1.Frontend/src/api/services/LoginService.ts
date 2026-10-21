import { apiClient } from "@/lib/api";

import { useQueryClient, useMutation } from "@tanstack/react-query";
import type { LoginRequest } from "../models";
import { currentUserQuery } from "./MeService";

export function useLogin() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) =>
      apiClient.post<void>("/api/login?useCookies=true", credentials),

    onSuccess: async () => {
      await query.cancelQueries();

      query.clear();

      await query.query(currentUserQuery)
    },
  });
}
