namespace Vicaria.Server.Features.PendingTimes.GetMy.DTOs;

public record class GetMyPendingTimesKindergartensDTO
(
    Guid Id,
    string Name,
    double? Latitude,
    double? Longitude
);
