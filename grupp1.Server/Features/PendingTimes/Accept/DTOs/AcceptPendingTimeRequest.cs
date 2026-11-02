namespace Vicaria.Server.Features.PendingTime.Accept.DTOs;
public record AcceptPendingTimeCommand(
    Guid UserId,
    Guid PendingTimeId
);