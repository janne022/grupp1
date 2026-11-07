using System.Security.Cryptography.X509Certificates;

namespace Vicaria.Server.Features.PendingTimes.Accept.DTOs;

public record class AcceptPendingTimeResponse
(
    Guid DecidedTimeId, //yes this should be a decidedTimeId not pendingtime
    DateTime StartTime,
    DateTime EndTime,
    Guid ManagerId,
    AcceptPendingTimeKindergartenDTO Kindergarten
);