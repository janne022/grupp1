namespace Vicaria.Server.Features.PendingTimes.Get.DTOs;

public record class GetPendingTimesKindergartensDTO
(
    Guid Id,
    string Name,
    double? Latitude,
    double? Longitude
);
