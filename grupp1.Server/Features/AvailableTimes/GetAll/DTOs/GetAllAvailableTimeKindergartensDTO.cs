using System;
using NetTopologySuite.Geometries;

namespace Vicaria.Server.Features.AvailableTimes.GetAll.DTOs;

public record class GetAllAvailableTimesKindergartensDTO
(
    Guid Id,
    string Name,
    Point? Location
);
