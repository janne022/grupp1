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

        var availableTime = await DbContext.AvailableTimes.Include(at => at.Kindergartens).ThenInclude(kat => kat.Kindergarten).FirstOrDefaultAsync(
            at => at.Id == command.AvailableTimeId && at.UserId == command.UserId,
            ct
        );

        HashSet<Guid> kindergartensInDto = command.Kindergartens ?? [];

        var kindergartens = await DbContext.Kindergartens.Where(kindergarten => kindergartensInDto.Contains(kindergarten.Id))
                .Select(k => new KindergartenDto(
                    k.Id,
                    k.Name,
                    k.Location != null ? k.Location.Y : null,
                    k.Location != null ? k.Location.X : null
                )).ToArrayAsync();

        if (availableTime is null)
        {
            _logger.LogWarning("AvailableTime {TimeId} was returned null.", command.AvailableTimeId);
            return new UpdateAvailableTimeResponse(
                null,
                command.StartTime,
                command.EndTime,
                kindergartens,
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
                null,
                UpdateAvailableTimeStatus.NotOwner
            );
        }

        // I will leave some helping comments because this is quite hard to comprehend at first glance:
        // --------------------------------------------------------------------------------------------

        // If Kindergartens is not null, create a local variable called selectedIds, an put the data from Kindergartens inside of it.
        if (command.Kindergartens is { } selectedIds)
        {

            // Get a collection of the current kindergartens coming in from the client (a.k.a. what should be in the entity after updating).
            HashSet<Kindergarten>? selectedKindergartens = await DbContext.Kindergartens
                .Where(k => selectedIds.Contains(k.Id))
                .ToHashSetAsync(ct);

            // Get a collection of the KindergartenAvailableTimes no longer needed (stale data).
            HashSet<KindergartenAvailableTime> staleKats = availableTime.Kindergartens
                .Where(kat => !selectedIds.Contains(kat.KindergartenId))
                .ToHashSet();

            // Remove the stale kats from the entity, both in the local version and our DB.
            foreach (KindergartenAvailableTime kat in staleKats)
            {
                availableTime.Kindergartens.Remove(kat);
                DbContext.KindergartenAvailableTimes.Remove(kat);
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
        await DbContext.SaveChangesAsync();

        _logger.LogInformation("before mapping out: {kindergartens}", availableTime);

        KindergartenDto[] kindergartenDtos = availableTime.Kindergartens.Select(k => new KindergartenDto(
            k.KindergartenId,
            k.Kindergarten.Name,
            k.Kindergarten.Location?.Y,
            k.Kindergarten.Location?.X
        )).ToArray();

        return new UpdateAvailableTimeResponse(
            availableTime.Id,
            availableTime.StartTime,
            availableTime.EndTime,
            kindergartenDtos,
            UpdateAvailableTimeStatus.Ok
        );
    }
}
