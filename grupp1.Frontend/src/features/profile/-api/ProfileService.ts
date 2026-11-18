import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/api";
import { currentUserQuery } from "@/shared/services/MeService";

type ChangeNamesRequest = { newFirstName: string; newLastName: string };
type ChangePasswordRequest = { oldPassword: string; newPassword: string };
type ChangeEmailRequest = { newEmail: string };

export function useChangeNames() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: ChangeNamesRequest) =>
      apiClient.patch<void>("/api/account/names", request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: currentUserQuery.queryKey,
      });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (request: ChangePasswordRequest) =>
      apiClient.post<void>("/api/manage/info", request),
  });
}

export function useChangeEmail() {
  return useMutation({
    mutationFn: (request: ChangeEmailRequest) =>
      apiClient.post<void>("/api/manage/info", request),
  });
}
