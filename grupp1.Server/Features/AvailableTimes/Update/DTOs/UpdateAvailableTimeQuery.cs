namespace Vicaria.Server.Features.AvailableTimes.Update.DTOs;

public record class UpdateAvailableTimeQuery
(
    Guid TimeId,
    DateTime StartTime,
    DateTime EndTime
);
