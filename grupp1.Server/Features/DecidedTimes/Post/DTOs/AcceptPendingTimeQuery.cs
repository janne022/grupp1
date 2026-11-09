using System.Security.Cryptography.X509Certificates;

namespace Vicaria.Server.Features.PendingTimes.Accept.DTOs;
public record class AcceptPendingTimeQuery
(
    Guid PendingTimeId,
    Guid UserId
);