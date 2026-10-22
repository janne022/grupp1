namespace Vicaria.Server.Features.AvailableTimes.GetMy.DTOs;

public record class GetMyAvailableTimesDTO
(
    Guid Id,
    DateTime StartTime,
    DateTime EndTime,
    IReadOnlyList<GetMyAvailableTimesKindergartensDTO> Kindergartens
);
