namespace Vicaria.Server.Features.AvailableTimes.GetMy.DTOs;

public record class GetMyAvailableTimesKindergartensDTO
(
    Guid Id,
    string Name,
    double? Latitude,
    double? Longitude
);
