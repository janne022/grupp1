using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.AddManagerToKindergarten.DTOs;
using Vicaria.Server.Features.DecidedTimes.Book;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.AddManagerToKindergarten;

public class AddManagerToKindergartenHandler(
    VicariaDbContext dbContext,
    ILogger<BookDecidedTimeHandler> _logger
) : IHandler<AddManagerToKindergartenCommand, AddManagerToKindergartenResult>
{
    public async Task<AddManagerToKindergartenResult> HandleAsync(
        AddManagerToKindergartenCommand command,
        CancellationToken cancellationToken = default)
    {
        var user = await dbContext.Users
            .Include(u => u.Kindergartens)
            .SingleAsync(u => u.Id == command.UserId);

        if (user.Kindergartens.Any(k => k.KindergartenId == command.KindergartenId))
        {
            _logger.LogInformation("User tried connecting to already apart of kindergarten id:{KindergartenId}", command.KindergartenId);
            return AddManagerToKindergartenResult.Failure(ErrorType.Conflict, "User is already a manager of this kindergarten.");

        }

        var kindergarten = await dbContext.Kindergartens.SingleOrDefaultAsync(k => k.Id == command.KindergartenId);

        if (kindergarten == null)
        {
            _logger.LogWarning("Could not find Kindergarten id:{KindergartenId}", command.KindergartenId);
            return AddManagerToKindergartenResult.Failure(ErrorType.NotFound, "Kindergarten was not found.");
        }

        user.Kindergartens.Add(new UserKinderGarten
        {
            KindergartenId = command.KindergartenId
        });
        await dbContext.SaveChangesAsync(cancellationToken);

        return AddManagerToKindergartenResult.Success();
    }
}