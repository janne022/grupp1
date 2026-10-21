using System;
using NetTopologySuite.Geometries;

namespace Vicaria.Server.Features.AvailableTimes.GetMy.DTOs;

public record class GetMyAvailableTimesKindergartensDTO
(
    Guid Id,
    string Name,
    Point? Location
);
