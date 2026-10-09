using System;

namespace Vicaria.Server.Features.AvailableTime.GetAll.DTOs;

public record class GetAllAvailableTimesResponse
(
    IReadOnlyList<GetAllAvailableTimeDTO> availableTimes
);
