namespace Vicaria.Server.Features.DecidedTimes.GetAll.DTOs;

public record class GetAllDecidedTimesDTO
(
    Guid TimeId,
    DateTime StartTime,
    DateTime EndTime,
    Guid SubstituteId,
    string SubstituteFirstName,
    string SubstituteLastName,
    Guid KindergartenId,
    string KindergartenName
);
