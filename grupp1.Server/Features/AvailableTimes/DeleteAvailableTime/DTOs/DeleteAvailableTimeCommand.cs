namespace Vicaria.Server.Features.AvailableTimes.Delete;

public record class DeleteAvailableTimeCommand
(
    Guid AvailableTimeId,
    Guid SubstituteId
);