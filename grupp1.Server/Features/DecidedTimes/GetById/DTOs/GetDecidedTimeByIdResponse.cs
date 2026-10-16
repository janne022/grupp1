namespace Vicaria.Server.Features.DecidedTimes.GetById.DTOs;

public record class GetDecidedTimeByIdResponse(
    Guid Id,
    DateTime? StartTime,
    DateTime? EndTime,
    SubstituteDTO SubstituteInfo,
    KindergartenDTO KindergartenInfo
);
