namespace Vicaria.Server.Features.DecidedTimes.GetAll.DTOs;

public record class GetAllDecidedTimesQuery
(
    Guid Userid,
    Guid[]? KindergartenIds,
    DateTime? FromTime,
    DateTime? ToTime
);
