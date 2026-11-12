namespace Vicaria.Server.Features.DecidedTimes.GetAll.DTOs;

public record class GetAllDecidedTimesDTO
(
    Guid DecidedTimeId,
    DateTime StartTime,
    DateTime EndTime,
    Guid SubstituteId,
    string SubstituteFirstName,
    string SubstituteLastName,
    Guid KindergartenId,
    string KindergartenName
);
