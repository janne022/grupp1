namespace Vicaria.Server.Features.PendingTimes.GetMy.DTOs;

public record class GetMyPendingTimesQuery
(
    Guid UserId,
    DateTime? FromTime,
    DateTime? ToTime
);
