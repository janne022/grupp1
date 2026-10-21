using System;
using System.Security.Cryptography.X509Certificates;
using Vicaria.Server.Domain.Models;

namespace Vicaria.Server.Features.AvailableTimes.GetMy.DTOs;

public record class GetMyAvailableTimesDTO
(
    Guid Id,
    DateTime StartTime,
    DateTime EndTime,
    IReadOnlyList<GetMyAvailableTimesKindergartensDTO> Kindergartens
);
