using grupp1.Server.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.AvailableTimes.Update.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.AvailableTimes.Update;

public class UpdateAvailableTimeHandler(
    VicariaDbContext DbContext,
    ILogger<UpdateAvailableTimeHandler> _logger
) : IHandler<UpdateAvailableTimeQuery, UpdateAvailableTimeResponse>
{
    public async Task<UpdateAvailableTimeResponse> HandleAsync(
        UpdateAvailableTimeQuery query,
        CancellationToken ct = default
    )
    {
        if (query.StartTime > query.EndTime || query.StartTime == query.EndTime)
        {
            _logger.LogWarning(
                "{EndTime} was not after {StartTime}",
                query.EndTime,
                query.StartTime
            );
            // Is this log necessary on the backend, I wonder?
            // Normally a user would get validation error on frontend.
            //
            // I suppose the fact that a user somehow got past the
            // frontend validator has value in itself, too...

            return new UpdateAvailableTimeResponse(UpdateAvailableTimeStatus.BadTime);
        }

        var availableTime = await DbContext.AvailableTimes.FirstOrDefaultAsync(
            at => at.Id == query.TimeId,
            ct
        );

        if (availableTime is null)
        {
            _logger.LogWarning("AvailableTiem {TimeId} was returned null.", query.TimeId);
            return new UpdateAvailableTimeResponse(UpdateAvailableTimeStatus.WasNull);
        }

        // TODO: We should check if the user who updates this time owns their AT object

        availableTime.StartTime = query.StartTime;
        availableTime.EndTime = query.EndTime;
        await DbContext.SaveChangesAsync(ct);

        return new UpdateAvailableTimeResponse(UpdateAvailableTimeStatus.Ok);
    }
}
