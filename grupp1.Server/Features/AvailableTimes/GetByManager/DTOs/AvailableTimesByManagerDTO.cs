namespace Vicaria.Server.Features.AvailableTimes.GetByManager;

public record class AvailableTimesByManagerDTO(
    Guid Id,
    DateTime StartTime,
    DateTime EndTime,
    string FirstName,
    string LastName
);