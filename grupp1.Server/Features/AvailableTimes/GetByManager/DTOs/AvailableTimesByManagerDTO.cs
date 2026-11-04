using Vicaria.Server.Features.GetByManager.DTOs;

namespace Vicaria.Server.Features.AvailableTimes.GetByManager;

public record class AvailableTimesByManagerDTO(
    Guid Id,
    DateTime StartTime,
    DateTime EndTime,
    UserInfoResponse Substitute
);