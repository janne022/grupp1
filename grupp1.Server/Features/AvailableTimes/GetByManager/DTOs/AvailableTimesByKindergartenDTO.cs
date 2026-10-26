namespace Vicaria.Server.Features.AvailableTimes.GetByManager;
public record class AvailableTimesByKindergartenDTO(
    Guid KindergartenId,
    string KindergartenName,
    AvailableTimesByManagerDTO[] AvailableTimes
);