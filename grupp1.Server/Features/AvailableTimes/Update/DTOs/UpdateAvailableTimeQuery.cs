namespace Vicaria.Server.Features.AvailableTimes.Update.DTOs;

public record class UpdateAvailableTimeQuery
(
    Guid TimeId,
    //TODO: Guid UserId,
    DateTime StartTime,
    DateTime EndTime
);
