using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain.Models;
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
        var availableTime = await DbContext.AvailableTimes.FirstOrDefaultAsync(
            at => at.Id == command.AvailableTimeId && at.UserId == command.UserId,
            ct
        );

        if (availableTime is null)
        {
            _logger.LogWarning(
                "AvailableTime {TimeId} not found or not owned by user {UserId}",
                command.AvailableTimeId,
                command.UserId
            );

            return new UpdateAvailableTimeResponse(
                null, null, null, null,
                UpdateAvailableTimeStatus.WasNull
            );
        }

        var startTime = command.StartTime ?? availableTime.StartTime;
        var endTime = command.EndTime ?? availableTime.EndTime;

        if (command.StartTime >= command.EndTime)
        {
            _logger.LogWarning(
                "{EndTime} was not after {StartTime} in UpdateAvailableTimeHandler for TimeId {timeId}",
                command.EndTime,
                command.StartTime,
                command.AvailableTimeId
            );

            return new UpdateAvailableTimeResponse(
                null,
                null,
                null,
                null,
                UpdateAvailableTimeStatus.BadTime
            );
        }

        availableTime.StartTime = startTime;
        availableTime.EndTime = endTime;

        if (command.Kindergartens is { } selectedIds)
        {

            // Get the Kindergarten entities for the selected IDs from the database.
            var existingLinks = await DbContext.KindergartenAvailableTimes
                .Where(kat => kat.AvailableTimeId == availableTime.Id)
                .ToListAsync(ct);

            DbContext.KindergartenAvailableTimes.RemoveRange(
                existingLinks.Where(kat => !selectedIds.Contains(kat.KindergartenId))
                );

            var existingKindergartenIds = existingLinks.Select(kat => kat.KindergartenId).ToHashSet();

            var selectedKindergartens = await DbContext.Kindergartens
            .Where(k => selectedIds.Contains(k.Id))
            .ToListAsync(ct);

            // Add missing relationships
            foreach (var kindergarten in selectedKindergartens)
            {
                if (existingKindergartenIds.Contains(kindergarten.Id))
                {
                    continue;
                }

                DbContext.KindergartenAvailableTimes.Add(new KindergartenAvailableTime
                {
                    AvailableTimeId = availableTime.Id,
                    KindergartenId = kindergarten.Id,
                    Kindergarten = kindergarten
                });
            }

            // Get a collection of the Kats still remaining in the AvailableTime
            HashSet<Guid> existingIds = availableTime.Kindergartens
                .Select(kat => kat.KindergartenId)
                .ToHashSet();

            // Loop through the collection of Kindergartens sent in from the client...
            foreach (var kindergarten in selectedKindergartens)
            {
                // ...and if they do not yet exist in the AvailableTime...
                if (!existingIds.Contains(kindergarten.Id))
                {
                    // ...create a new kat and add it.
                    availableTime.Kindergartens.Add(
                        new KindergartenAvailableTime
                        {
                            AvailableTimeId = availableTime.Id,
                            KindergartenId = kindergarten.Id,
                            Kindergarten = kindergarten
                        }
                    );
                }
            }
        }

        // Finally save the changes made.
        await DbContext.SaveChangesAsync(ct);

        var kindergartenDtos = await DbContext.KindergartenAvailableTimes
           .AsNoTracking()
           .Where(kat => kat.AvailableTimeId == availableTime.Id)
           .Select(kat => new KindergartenDto(
               kat.KindergartenId,
               kat.Kindergarten.Name,
               kat.Kindergarten.Location != null
                   ? kat.Kindergarten.Location.Y
                   : null,
               kat.Kindergarten.Location != null
                   ? kat.Kindergarten.Location.X
                   : null
           ))
           .ToArrayAsync(ct);

        return new UpdateAvailableTimeResponse(
            availableTime.Id,
            availableTime.StartTime,
            availableTime.EndTime,
            kindergartenDtos,
            UpdateAvailableTimeStatus.Ok
        );
    }
}
