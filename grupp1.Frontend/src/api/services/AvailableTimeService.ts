import { useQuery } from "@tanstack/react-query";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function GetAllAvailableTimes() {
  const { isPending, error, data } = useQuery({
    queryKey: ["availableTimesdata"],
    queryFn: () =>
      fetch(`${baseUrl}/api/availabletimes`, {
        method: "GET",
      }).then((response) => response.json()),
  });

  return { isPending, error, data };
}
export { GetAllAvailableTimes };
