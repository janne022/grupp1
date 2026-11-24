import { apiClient } from "@/shared/api/api";
import { useMutation } from "@tanstack/react-query"

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) =>
      apiClient.post<void>("/api/auth/forgot-password", { email }),
  });
}