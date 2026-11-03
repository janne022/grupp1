namespace Vicaria.Server.Features.DecidedTimes.GetAll.DTOs;

public record class GetAllDecidedTimesResponse
(
    IReadOnlyList<GetAllDecidedTimesDTO> DecidedTimes,
    GetAllDecidedTimesStatus Report
);
