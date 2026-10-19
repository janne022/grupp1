using NetTopologySuite.Geometries;

namespace Vicaria.Server.Features.DecidedTimes.Book.DTOs;

public record class KindergartenDTO(
    Guid Id,
    string Name,
    Point? Location
);