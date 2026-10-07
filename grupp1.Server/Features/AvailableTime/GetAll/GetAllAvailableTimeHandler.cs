using System;
using grupp1.Server.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.AvailableTime.GetAll.DTOs;
using Vicaria.Server.Infrastructure;

namespace grupp1.Server.Features.AvailableTime.GetAll;

public class GetAllAvailableTimeHandler(
    VicariaDbContext DbContext,
    ILogger<GetAllAvailableTimeHandler> _logger
) : IHandler<GetAllAvailableTimesQuery, GetAllAvailableTimesResponse>
{
    public async Task<GetAllAvailableTimesResponse> HandleAsync(
        GetAllAvailableTimesQuery query,
        CancellationToken cancellationToken = default
    )
    {
        _logger.LogInformation("HandleAsync entered");

        var availableTimes = await DbContext
            .AvailableTimes.Select(at => new GetAllAvailableTimeDTO(
                at.Id,
                at.StartTime,
                at.EndTime,
                at.Kindergartens.Select(kinder => new GetAllAvailableTimeKindergartensDTO(
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
