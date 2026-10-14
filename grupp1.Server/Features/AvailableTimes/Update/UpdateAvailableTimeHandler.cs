using Vicaria.Server.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.AvailableTimes.Update.DTOs;

namespace Vicaria.Server.Features.AvailableTimes.Update;

public class UpdateAvailableTimeHandler(
    VicariaDbContext DbContext,
    ILogger<UpdateAvailableTimeHandler> _logger
) : IHandler<UpdateAvailableTimeCommand, UpdateAvailableTimeResponse>
{
    public async Task<UpdateAvailableTimeResponse> HandleAsync(
        UpdateAvailableTimeCommand command,
        CancellationToken ct = default
    )
    {
        if (command.StartTime > command.EndTime || command.StartTime == command.EndTime)
        {
            _logger.LogWarning(
                "{EndTime} was not after {StartTime}",
                command.EndTime,
                command.StartTime
            );
            // Is this log necessary on the backend, I wonder?
            // Normally a user would get validation error on frontend.
            //
            // I suppose the fact that a user somehow got past the
            // frontend validator has value in itself, too...

            return new UpdateAvailableTimeResponse(
                null,
                null,
                null,
                UpdateAvailableTimeStatus.BadTime
            );
        }

        var availableTime = await DbContext.AvailableTimes.FirstOrDefaultAsync(
            at => at.Id == command.TimeId,
            ct
        );

        if (availableTime is null)
        {
            _logger.LogWarning("AvailableTiem {TimeId} was returned null.", command.TimeId);
            return new UpdateAvailableTimeResponse(
                null,
                command.StartTime,
                command.EndTime,
                UpdateAvailableTimeStatus.WasNull
            );
        }

        // TODO: We should check if the user who updates this time owns their AT object

        availableTime.StartTime = command.StartTime;
        availableTime.EndTime = command.EndTime;
        await DbContext.SaveChangesAsync(ct);

        return new UpdateAvailableTimeResponse(
            command.TimeId,
            command.StartTime,
            command.EndTime,
            UpdateAvailableTimeStatus.Ok
        );
    }
}
