using Vicaria.Server.Domain.Models;

namespace Vicaria.Server.Features.DecidedTimes.GetAll.DTOs;

public record class GetAllDecidedTimesDTO
(
    Guid Id,
    DateTime StartTime,
    DateTime EndTime,
    Guid UserId,
    string SubstituteFirstName,
    string SubstituteLastName,
    Guid KindergartenId,
    string KindergartenName
);
