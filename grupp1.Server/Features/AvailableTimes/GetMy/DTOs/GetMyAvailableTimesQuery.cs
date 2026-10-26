namespace Vicaria.Server.Features.AvailableTimes.GetMy.DTOs;

public record class GetMyAvailableTimesQuery
(
    Guid UserId,
    DateTime? FromTime,
    DateTime? ToTime
);
