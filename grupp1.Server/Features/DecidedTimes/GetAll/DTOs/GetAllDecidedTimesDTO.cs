using Vicaria.Server.Domain.Models;

namespace Vicaria.Server.Features.DecidedTimes.GetAll.DTOs;

public record class GetAllDecidedTimesDTO
(
    Guid Id,
    DateTime StartTime,
    DateTime EndTime,
    Guid KindergartenId
    // TODO: Add the sub User to this when we have authorisation
);
