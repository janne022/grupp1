using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.AvailableTimes.GetAll.DTOs;
using Vicaria.Server.Infrastructure;

namespace grupp1.Server.Features.AvailableTimes.GetAll;

public class GetAllAvailableTimesHandler(
    VicariaDbContext DbContext,
    ILogger<GetAllAvailableTimesHandler> _logger
) : IHandler<GetAllAvailableTimesQuery, GetAllAvailableTimesResponse>
{
    public async Task<GetAllAvailableTimesResponse> HandleAsync(
        GetAllAvailableTimesQuery query,
        CancellationToken cancellationToken = default
    )
    {
        _logger.LogInformation("HandleAsync entered");

        var availableTimes = await DbContext
            .AvailableTimes.Select(at => new GetAllAvailableTimesDTO(
                at.Id,
                at.StartTime,
                at.EndTime,
                at.Kindergartens.Select(kinder => new GetAllAvailableTimesKindergartensDTO(
                        kinder.Kindergarten.Id,
                        kinder.Kindergarten.Name,
                        kinder.Kindergarten.Location
                    ))
                    .ToList()
            ))
            .ToListAsync(cancellationToken);

        // TODO: Get UserId and filter by it, when authorisation is up.

        return new GetAllAvailableTimesResponse(availableTimes);
    }
}
