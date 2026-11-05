using ErrorOr;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.PendingTimes.Accept.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.PendingTimes.Accept;

public class AcceptPendingTimeHandler(
    VicariaDbContext dbContext,
    ILogger<AcceptPendingTimeHandler> _logger
) : IHandler<AcceptPendingTimeQuery, ErrorOr<AcceptPendingTimeResponse>>
{
    public async Task<ErrorOr<AcceptPendingTimeResponse>> HandleAsync(
        AcceptPendingTimeQuery query, CancellationToken cancellationToken = default)
    {
        var pendingTime = await dbContext.PendingTimes
        .Include(pt => pt.AvailableSubs)
        .SingleOrDefaultAsync(pt => pt.Id == query.PendingTimeId, cancellationToken);

        if (pendingTime == null)
        {
            _logger.LogError("PendingTimeId {PendingTimeId} not found", query.PendingTimeId);
            return Error.NotFound("PendingTime.NotFound", $"No results from pendingTimeId: {query.PendingTimeId}");
        }

        var user = await dbContext.Users.SingleOrDefaultAsync(pt => pt.Id == query.UserId, cancellationToken);
        if (user == null)
        {//i dont think this can happen 
            _logger.LogCritical("UserId: {UserId} not found", query.UserId);
            return Error.NotFound("User.NotFound", $"User not found");
        }

        if (pendingTime.AvailableSubs.Any(a => a.UserId == user.Id))
        {
            _logger.LogWarning("User {UserId} is not in AvailableSubs for PendingTime {PendingTimeId}",
                query.UserId, query.PendingTimeId);
            return Error.Validation("PendingTime.UserNotAvailable", "This user is not available for this pending time.");
        }

        var decidedTime = new DecidedTime
        {
            StartTime = pendingTime.StartTime,
            EndTime = pendingTime.EndTime,
            UserId = user.Id,
            KindergartenId = pendingTime.KindergartenId
        };

        await dbContext.DecidedTimes.AddAsync(decidedTime, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);

        /* return new AcceptPendingTimeResponse//NOT  DONE NEED MODELS UPDATED
        {//NOT  DONE NEED MODELS UPDATED
            PendingTimeId = //NOT  DONE NEED MODELS UPDATED
        };//NOT  DONE NEED MODELS UPDATED */
    }
}