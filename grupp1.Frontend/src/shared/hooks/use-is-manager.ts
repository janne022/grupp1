import { useQuery } from "@tanstack/react-query";
import { currentUserQuery } from "@/shared/services/MeService";

export function useIsManager() {
  const { data: user } = useQuery(currentUserQuery);
  return user?.roles?.includes("Manager") ?? false;
}