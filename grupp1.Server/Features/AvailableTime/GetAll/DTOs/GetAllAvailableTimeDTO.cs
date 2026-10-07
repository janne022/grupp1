using System;
using System.Security.Cryptography.X509Certificates;
using Vicaria.Server.Domain.Models;

namespace Vicaria.Server.Features.AvailableTime.GetAll.DTOs;

public record class GetAllAvailableTimeDTO
(
    Guid Id,
    DateTime StartTime,
    DateTime EndTime,
    IReadOnlyList<GetAllAvailableTimeKindergartensDTO> Kindergartens
);
