import { useQuery } from "@tanstack/react-query";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

function GetAllKindergartens() {
    const { isPending, error, data } = useQuery({
        queryKey: ["kindergartensdata"],
        queryFn: () =>
            fetch(`${baseUrl}/api/kindergartens`, {
                method: "GET",
            }).then(response => response.json())
    })

    return { isPending, error, data }
}

export { GetAllKindergartens }