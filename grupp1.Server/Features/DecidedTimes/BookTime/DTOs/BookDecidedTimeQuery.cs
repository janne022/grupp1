namespace Vicaria.Server.Features.DecidedTimes.Book.DTOs;

public record class BookDecidedTimeQuery(
    Guid AvailableTimeGuid,
    DateTime StartTime,
    DateTime EndTime,
    Guid KindergartenId
);