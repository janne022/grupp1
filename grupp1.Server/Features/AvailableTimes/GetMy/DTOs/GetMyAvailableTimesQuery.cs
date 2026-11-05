namespace Vicaria.Server.Features.AvailableTimes.GetMy.DTOs;

public record class GetMyAvailableTimesQuery
(
    Guid SubstituteId,
    DateTime? FromTime,
    DateTime? ToTime
);
