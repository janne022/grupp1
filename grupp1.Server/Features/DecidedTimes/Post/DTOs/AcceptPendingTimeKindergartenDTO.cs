namespace Vicaria.Server.Features.PendingTimes.Accept.DTOs;
public record class AcceptPendingTimeKindergartenDTO
(
    Guid Id,
    string Name,
    double? Latitude,
    double? Longitude
);