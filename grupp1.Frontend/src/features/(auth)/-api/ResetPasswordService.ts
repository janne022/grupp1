import { apiClient } from "@/shared/api/api";
import { useMutation } from "@tanstack/react-query"

type ResetPasswordRequest = {
    userId: string;
    token: string;
    newPassword: string;
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (request: ResetPasswordRequest) =>
      apiClient.post<void>("/api/auth/reset-password", request),
  });
}