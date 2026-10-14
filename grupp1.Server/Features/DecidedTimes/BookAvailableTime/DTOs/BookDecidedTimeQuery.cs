namespace Vicaria.Server.Features.DecidedTimes.Book.DTOs;

public record class BookDecidedTimeQuery(
    Guid AvailableTimeGuid,
    Guid KindergartenId
);