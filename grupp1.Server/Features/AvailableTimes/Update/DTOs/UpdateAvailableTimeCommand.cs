namespace Vicaria.Server.Features.AvailableTimes.Update.DTOs;

public record class UpdateAvailableTimeCommand
(
    Guid TimeId,
    // TODO: Guid UserId,
    DateTime StartTime,
    DateTime EndTime
);
