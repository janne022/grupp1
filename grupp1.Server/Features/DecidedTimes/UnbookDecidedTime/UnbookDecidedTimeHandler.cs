using ErrorOr;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime
{
    public class UnbookDecidedTimeHandler(
        VicariaDbContext context,
        ILogger<UnbookDecidedTimeHandler> logger
    ) : IHandler<UnbookDecidedTimeCommand, ErrorOr<Deleted>>
    {
        public async Task<ErrorOr<Deleted>> HandleAsync(
            UnbookDecidedTimeCommand command,
            CancellationToken cancellationToken = default
        )
        {
            var decidedTime = await context.DecidedTimes
                .Include(dt => dt.PendingTime)
                .FirstOrDefaultAsync(
                dt =>
                    dt.Id == command.DecidedTimeId
                    && (
                        dt.Kindergarten.Managers.Any(m => m.UserId == command.UserId)
                        || dt.SubstituteId == command.UserId
                    ),
                cancellationToken
            );

            if (decidedTime is null)
            {
                logger.LogWarning(
                    "DecidedTime with Id {DecidedTimeId} could not be found",
                    command.DecidedTimeId
                );
                return Error.NotFound();
            }

            decidedTime.PendingTime.IsBooked = false;
            context.DecidedTimes.Remove(decidedTime);
            await context.SaveChangesAsync(cancellationToken);

            logger.LogInformation(
                "DecidedTime {DecidedTimeId} removed successfully",
                decidedTime.Id
            );
            return Result.Deleted;
        }
    }
}
