namespace Vicaria.Server.Features.DecidedTimes.GetAll.DTOs;

public record class GetAllDecidedTimesQuery
(
    Guid ManagerId,
    Guid[]? KindergartenIds,
    DateTime? FromTime,
    DateTime? ToTime
);
