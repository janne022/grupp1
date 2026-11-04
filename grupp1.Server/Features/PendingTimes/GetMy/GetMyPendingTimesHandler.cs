using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.PendingTimes.GetMy.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.PendingTimes.GetMy;

public class GetMyPendingTimesHandler(VicariaDbContext DbContext)
    : IHandler<GetMyPendingTimesQuery, GetMyPendingTimesResponse>
{
    public async Task<GetMyPendingTimesResponse> HandleAsync(
        GetMyPendingTimesQuery query,
        CancellationToken cancellationToken = default
    )
    {
        var relevantTimes = DbContext.PendingTimes.Where(pt =>
            !pt.IsBooked && pt.AvailableSubs.Any(sub => sub.UserId == query.UserId)
        );

        if (query.FromTime is not null)
        {
            relevantTimes = relevantTimes.Where(pt => pt.StartTime >= query.FromTime.Value);
        }

        if (query.ToTime is not null)
        {
            relevantTimes = relevantTimes.Where(pt => pt.StartTime <= query.ToTime.Value);
        }

        var filteredPendingTimes = await relevantTimes
            .Select(pt => new GetMyPendingTimesDTO(
                pt.Id,
                pt.StartTime,
                pt.EndTime,
                new GetMyPendingTimesKindergartensDTO(
                    pt.Kindergarten.Id,
                    pt.Kindergarten.Name,
                    pt.Kindergarten.Location != null ? pt.Kindergarten.Location.Y : null,
                    pt.Kindergarten.Location != null ? pt.Kindergarten.Location.X : null
                )
            ))
            .ToListAsync(cancellationToken);

        return new GetMyPendingTimesResponse(filteredPendingTimes);
    }
}
