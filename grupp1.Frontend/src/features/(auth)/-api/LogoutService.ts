import { apiClient } from "@/shared/api/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { currentUserQuery } from "../../../shared/services/MeService";
import type { UserInfoResponse } from "@/shared/api/models";
import { useNavigate } from "@tanstack/react-router";

// Hook to log out a user. On success, the current user query is invalidated and refetched.
export function useLogout() {
  const query = useQueryClient();

  return useMutation({
    mutationFn: () => apiClient.post<void>("/api/auth/logout"),

    onSuccess: async () => {
      await query.cancelQueries();

      query.clear();

      await query.query(currentUserQuery);
      query.setQueryData<UserInfoResponse | null>(["currentUser"], null);
    },
  });
}

export function useLogoutAndRedirectToLogin() {
  const logout = useLogout();
  const navigate = useNavigate();

  async function logoutAndRedirectToLogin() {
    try {
      await logout.mutateAsync();
      await navigate({ to: "/login" });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }

  return { logoutAndRedirectToLogin, isPending: logout.isPending };
}
