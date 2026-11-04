using Vicaria.Server.Domain.Models;

namespace Vicaria.Server.Features.AvailableTimes.Update.DTOs;

public record class UpdateAvailableTimeQuery
(
    Guid AvailableTimeId,
    DateTime? StartTime,
    DateTime? EndTime,
    Guid[]? Kindergartens
);
