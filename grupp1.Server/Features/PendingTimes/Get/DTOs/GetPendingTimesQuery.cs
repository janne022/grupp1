namespace Vicaria.Server.Features.PendingTimes.Get.DTOs;

public record class GetPendingTimesQuery
(
    Guid UserId,
    DateTime? FromTime,
    DateTime? ToTime,
    bool IncludeBookedTimes
);
