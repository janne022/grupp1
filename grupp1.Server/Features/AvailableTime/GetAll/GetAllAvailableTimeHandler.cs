using System;
using grupp1.Server.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.AvailableTime.GetAll.DTOs;
using Vicaria.Server.Infrastructure;

namespace grupp1.Server.Features.AvailableTime.GetAll;

public class GetAllAvailableTimeHandler(
    VicariaDbContext DbContext,
    ILogger<GetAllAvailableTimeHandler> _logger
) : IHandler<GetAllAvailableTimesRequest, GetAllAvailableTimesResponse>
{
    public async Task<GetAllAvailableTimesResponse> HandleAsync(
        GetAllAvailableTimesRequest request,
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

        return new GetAllAvailableTimesResponse(availableTimes);
    }
}
