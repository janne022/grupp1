namespace Vicaria.Server.Features.AvailableTimes.Update.DTOs;

public record class UpdateAvailableTimeCommand
(
    Guid TimeId,
    DateTime StartTime,
    DateTime EndTime
);
