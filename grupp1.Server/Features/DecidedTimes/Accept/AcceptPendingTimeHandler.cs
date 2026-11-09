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
        .Include(pt => pt.Kindergarten)
        .SingleOrDefaultAsync(pt => pt.Id == query.PendingTimeId, cancellationToken);

        if (pendingTime == null)
        {
            _logger.LogError("PendingTimeId {PendingTimeId} not found", query.PendingTimeId);
            return Error.NotFound("PendingTime.NotFound", $"Pending time not found");
        }

        if (pendingTime.IsBooked)
        {
            _logger.LogInformation("User {UserId} tried booking an already booked time {PendingTimeId}", query.UserId, query.PendingTimeId);
            return Error.Conflict("PendingTime.Conflict", "This time is no longer available.");
        }
        pendingTime.IsBooked = true;

        var user = await dbContext.Users.SingleOrDefaultAsync(pt => pt.Id == query.UserId, cancellationToken);
        if (user == null)
        {//i dont think this can happen 
            _logger.LogCritical("UserId: {UserId} not found", query.UserId);
            return Error.NotFound("User.NotFound", $"User not found");
        }

        if (!pendingTime.AvailableSubs.Any(a => a.UserId == user.Id))
        {
            _logger.LogWarning("User {UserId} is not an AvailableSubs for PendingTime {PendingTimeId}",
                query.UserId, query.PendingTimeId);
            return Error.Validation("PendingTime.UserNotAvailable", "This user is not available for this pending time.");
        }

        var decidedTime = new DecidedTime
        {
            Id = Guid.CreateVersion7(),
            StartTime = pendingTime.StartTime,
            EndTime = pendingTime.EndTime,
            SubstituteId = user.Id,
            KindergartenId = pendingTime.KindergartenId,
            PendingTimeId = pendingTime.Id,
            ManagerId = pendingTime.ManagerId
        };

        await dbContext.DecidedTimes.AddAsync(decidedTime, cancellationToken);

        await dbContext.SaveChangesAsync(cancellationToken);

        return new AcceptPendingTimeResponse(
            DecidedTimeId: decidedTime.Id,
            StartTime: decidedTime.StartTime,
            EndTime: decidedTime.EndTime,
            ManagerId: decidedTime.ManagerId,
            Kindergarten: new AcceptPendingTimeKindergartenDTO(
                Id: decidedTime.KindergartenId,
                Name: pendingTime.Kindergarten.Name,
                Latitude: pendingTime.Kindergarten.Location?.Y,
                Longitude: pendingTime.Kindergarten.Location?.X
            )
        );
    }
}