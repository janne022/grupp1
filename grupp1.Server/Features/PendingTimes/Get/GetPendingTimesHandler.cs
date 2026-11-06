using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.PendingTimes.Get.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.PendingTimes.Get;

public class GetPendingTimesHandler(VicariaDbContext DbContext)
    : IHandler<GetPendingTimesQuery, GetPendingTimesResponse>
{
    public async Task<GetPendingTimesResponse> HandleAsync(
        GetPendingTimesQuery query,
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
            .Select(pt => new GetPendingTimesDTO(
                pt.Id,
                pt.StartTime,
                pt.EndTime,
                new GetPendingTimesKindergartensDTO(
                    pt.Kindergarten.Id,
                    pt.Kindergarten.Name,
                    pt.Kindergarten.Location != null ? pt.Kindergarten.Location.Y : null,
                    pt.Kindergarten.Location != null ? pt.Kindergarten.Location.X : null
                )
            ))
            .ToListAsync(cancellationToken);

        return new GetPendingTimesResponse(filteredPendingTimes);
    }
}
