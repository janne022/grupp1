namespace Vicaria.Server.Features.PendingTimes.Get.DTOs;

public record class PendingTimeDto
(
    Guid Id,
    DateTime StartTime,
    DateTime EndTime,
    KindergartenDto Kindergarten
);
