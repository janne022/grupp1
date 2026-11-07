using System.Security.Cryptography.X509Certificates;

namespace Vicaria.Server.Features.PendingTimes.Accept.DTOs;

public record class AcceptPendingTimeResponse
(
    Guid PendingTimeId,
    DateTime StartTime,
    DateTime EndTime,
    Guid UserId,
    Guid KindergartenId
);