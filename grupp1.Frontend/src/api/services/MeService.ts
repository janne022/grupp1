import { apiClient } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],

    queryFn: async({ signal }) => {
        try {
            
        } catch (error) {
            
        }
    },
  });
}
