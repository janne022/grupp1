using NetTopologySuite.Geometries;

namespace Vicaria.Server.Features.DecidedTimes.Book.DTOs;

public record class BookTimeKindergartenDTO(
    Guid Id,
    string Name,
    double? Latitude,
    double? Longitude
);