using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.AvailableTimes.GetMy.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.AvailableTimes.GetMy;

public class GetMyAvailableTimesHandler(
    VicariaDbContext DbContext
) : IHandler<GetMyAvailableTimesQuery, GetMyAvailableTimesResponse>
{
    public async Task<GetMyAvailableTimesResponse> HandleAsync(
        GetMyAvailableTimesQuery query,
        CancellationToken cancellationToken = default
    )
    {
        var fromTime = DateTime.UtcNow.Date;

        var availableTimes = await DbContext
            .AvailableTimes.Where(at => at.UserId == query.UserId)
            .Where(at => at.StartTime >= fromTime)
            .OrderBy(at => at.StartTime)
            .Select(at => new GetMyAvailableTimesDTO(
                at.Id,
                at.StartTime,
                at.EndTime,
                at.Kindergartens.Select(link => new GetMyAvailableTimesKindergartensDTO(
                        link.Kindergarten.Id,
                        link.Kindergarten.Name,
                        link.Kindergarten.Location != null ? link.Kindergarten.Location.Y : null,
                        link.Kindergarten.Location != null ? link.Kindergarten.Location.X : null
                    ))
                    .ToList()
            ))
            .ToListAsync(cancellationToken);

        return new GetMyAvailableTimesResponse(availableTimes);
    }
}
