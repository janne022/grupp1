namespace Vicaria.Server.Features.PendingTimes.GetMy.DTOs;

public record class GetMyPendingTimesDTO
(
    Guid Id,
    DateTime StartTime,
    DateTime EndTime,
    GetMyPendingTimesKindergartensDTO Kindergartens
);
