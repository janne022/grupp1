namespace Vicaria.Server.Features.AvailableTimes.GetByManager;
public record class KindergartenByManagerDTO(
    Guid KindergartenId,
    string Name,
    AvailableTimesByManagerDTO[] AvailableTimes
);