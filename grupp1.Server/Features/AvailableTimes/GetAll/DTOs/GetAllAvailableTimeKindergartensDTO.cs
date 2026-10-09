using System;
using NetTopologySuite.Geometries;

namespace Vicaria.Server.Features.AvailableTime.GetAll.DTOs;

public record class GetAllAvailableTimeKindergartensDTO
(
    Guid Id,
    string Name,
    Point? Location
);
