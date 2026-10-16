namespace Vicaria.Server.Features.DecidedTimes.Book.DTOs;

public record class BookDecidedTimeResponse(
    Guid Id,
    DateTime? StartTime,
    DateTime? EndTime,
    SubstituteDTO SubstituteInfo,
    KindergartenDTO KindergartenInfo
);