namespace Vicaria.Server.Features.PendingTimes.Get.DTOs;

public record class KindergartenDto
(
    Guid Id,
    string Name,
    double? Latitude,
    double? Longitude
);
