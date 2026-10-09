using System;

namespace Vicaria.Server.Features.AvailableTimes.GetAll.DTOs;

public record class GetAllAvailableTimesResponse
(
    IReadOnlyList<GetAllAvailableTimesDTO> availableTimes
);
