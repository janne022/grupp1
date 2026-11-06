namespace Vicaria.Server.Features.PendingTimes.Get.DTOs;

public record class GetPendingTimesResponse
(
    IReadOnlyList<GetPendingTimesDTO> PendingTimes
);
