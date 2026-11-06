using Vicaria.Server.Domain.Models;

namespace Vicaria.Server.Features.AvailableTimes.Update.DTOs;

public record class UpdateAvailableTimeCommand
(
    Guid AvailableTimeId,
    Guid UserId,
    DateTime? StartTime,
    DateTime? EndTime,
    HashSet<Guid>? Kindergartens
);
