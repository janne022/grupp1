using Vicaria.Server.Domain.Models;

namespace Vicaria.Server.Features.AvailableTimes.Update.DTOs;

public record class UpdateAvailableTimeResponse
(
    Guid? TimeId,
    DateTime? StartTime,
    DateTime? EndTime,
    UpdateAvailableTimeKindergartenDTO[]? Kindergartens,
    UpdateAvailableTimeStatus StatusMessage
);