import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/api/api";
import type {
  EditPendingTimeRequest,
  EditPendingTimeResponse,
  PostPendingTimeRequest,
  PostPendingTimeResponse,
} from "@/shared/api/models";

function PostPendingTime() {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (req: PostPendingTimeRequest) => {
      return apiClient.post<PostPendingTimeResponse>("/api/pending-times", req);
    },

    onSuccess: async () => {
      await query.invalidateQueries({
        queryKey: ["pendingTimesData"],
      });
    },
  });
}

function EditPendingTime() {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (req: EditPendingTimeRequest) => {
      return apiClient.patch<EditPendingTimeResponse>(
        "/api/pending-times",
        req,
      );
    },

    onSuccess: async () => {
      await query.invalidateQueries({
        queryKey: ["pendingTimesData"],
      });
    },
  });
}

function DeletePendingTime() {
  const query = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => {
      return apiClient.delete<void>(`/api/pending-times/${id}`);
    },

    onSuccess: async () => {
      await query.invalidateQueries({
        queryKey: ["pendingTimesData"],
      });
    },
  });
}

export { PostPendingTime, EditPendingTime, DeletePendingTime };
