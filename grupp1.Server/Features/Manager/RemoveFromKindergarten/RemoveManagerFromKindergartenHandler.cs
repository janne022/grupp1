using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.RemoveManagerFromKindergarten.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.RemoveManagerFromKindergarten;

public class RemoveManagerFromKindergartenHandler(
    VicariaDbContext dbContext,
    ILogger<RemoveManagerFromKindergartenHandler> _logger
) : IHandler<RemoveManagerFromKindergartenCommand, RemoveManagerFromKindergartenResult>
{
    public async Task<RemoveManagerFromKindergartenResult> HandleAsync(
        RemoveManagerFromKindergartenCommand command,
        CancellationToken cancellationToken = default)
    {
        var kindergarten = await dbContext.Kindergartens.SingleOrDefaultAsync(k => k.Id == command.KindergartenId, cancellationToken);

        if (kindergarten == null)
        {
            _logger.LogWarning("Could not find Kindergarten id:{KindergartenId}", command.KindergartenId);
            return RemoveManagerFromKindergartenResult.Failure(ErrorType.NotFound, "Kindergarten was not found.");
        }

        var user = await dbContext.Users
            .Include(u => u.Kindergartens)
            .SingleAsync(u => u.Id == command.UserId, cancellationToken);

        if (!user.Kindergartens.Any(k => k.KindergartenId == command.KindergartenId))
        {
            _logger.LogInformation("User tried to be removed from kindergarten they're not a part of. id:{KindergartenId}", command.KindergartenId);
            return RemoveManagerFromKindergartenResult.Failure(ErrorType.Conflict, "User is already not a member of this kindergarten.");
        }

        user.Kindergartens.Remove(user.Kindergartens.Single(k => k.KindergartenId == kindergarten.Id));

        await dbContext.SaveChangesAsync(cancellationToken);

        return RemoveManagerFromKindergartenResult.Success();
    }
}