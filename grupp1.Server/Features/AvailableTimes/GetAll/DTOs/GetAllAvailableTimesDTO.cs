using System;
using System.Security.Cryptography.X509Certificates;
using Vicaria.Server.Domain.Models;

namespace Vicaria.Server.Features.AvailableTimes.GetAll.DTOs;

public record class GetAllAvailableTimesDTO
(
    Guid Id,
    DateTime StartTime,
    DateTime EndTime,
    IReadOnlyList<GetAllAvailableTimesKindergartensDTO> Kindergartens
);
