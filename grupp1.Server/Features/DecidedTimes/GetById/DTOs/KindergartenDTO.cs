
namespace Vicaria.Server.Features.DecidedTimes.GetById.DTOs;

public record class KindergartenDTO(
    Guid Id,
    string Name,
    double? Latitude,
    double? Longitude
);

