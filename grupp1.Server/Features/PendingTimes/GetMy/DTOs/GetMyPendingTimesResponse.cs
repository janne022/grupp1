namespace Vicaria.Server.Features.PendingTimes.GetMy.DTOs;

public record class GetMyPendingTimesResponse
(
    IReadOnlyList<GetMyPendingTimesDTO> PendingTimes
);
