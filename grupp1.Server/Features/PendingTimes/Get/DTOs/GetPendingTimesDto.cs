namespace Vicaria.Server.Features.PendingTimes.Get.DTOs;

public record class GetPendingTimesDTO
(
    Guid Id,
    DateTime StartTime,
    DateTime EndTime,
    GetPendingTimesKindergartensDTO Kindergartens
);
