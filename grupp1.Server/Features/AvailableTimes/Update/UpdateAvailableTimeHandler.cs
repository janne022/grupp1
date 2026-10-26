using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.AvailableTimes.Update.DTOs;
using Vicaria.Server.Infrastructure;

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
        if (command.StartTime >= command.EndTime)
        {
            _logger.LogWarning(
                "{EndTime} was not after {StartTime} in UpdateAvailableTimeHandler for TimeId {timeId}",
                command.EndTime,
                command.StartTime,
                command.TimeId
            );

            return new UpdateAvailableTimeResponse(
                null,
                null,
                null,
                UpdateAvailableTimeStatus.BadTime
            );
        }

        var availableTime = await DbContext.AvailableTimes.FirstOrDefaultAsync(
            at => at.Id == command.TimeId && at.UserId == command.UserId,
            ct
        );

        if (availableTime is null)
        {
            _logger.LogWarning("AvailableTime {TimeId} was returned null.", command.TimeId);
            return new UpdateAvailableTimeResponse(
                null,
                command.StartTime,
                command.EndTime,
                UpdateAvailableTimeStatus.WasNull
            );
        }

        if (availableTime.UserId != command.UserId)
        {
            _logger.LogWarning(
                "User {id} not recognised as owner of AvailableTime {availTimeId} in UpdateAvailableHandler",
                command.UserId,
                availableTime.Id
            );
            return new UpdateAvailableTimeResponse(
                null,
                null,
                null,
                UpdateAvailableTimeStatus.NotOwner
            );
        }

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
