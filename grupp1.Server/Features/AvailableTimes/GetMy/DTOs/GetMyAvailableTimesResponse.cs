using System;

namespace Vicaria.Server.Features.AvailableTimes.GetMy.DTOs;

public record class GetMyAvailableTimesResponse
(
    IReadOnlyList<GetMyAvailableTimesDTO> availableTimes
);
