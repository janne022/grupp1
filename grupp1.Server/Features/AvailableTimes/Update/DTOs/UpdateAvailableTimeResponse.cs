namespace Vicaria.Server.Features.AvailableTimes.Update.DTOs;

public record class UpdateAvailableTimeResponse
(
    bool Succeeded,
    UpdateAvailableTimeStatus.Status? ErrorMessage
);