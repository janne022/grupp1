using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime
{
    public class UnbookDecidedTimeHandler(
        VicariaDbContext context,
        ILogger<UnbookDecidedTimeHandler> logger
    ) : IHandler<UnbookDecidedTimeCommand, UnbookDecidedTimeStatus>
    {
        public async Task<UnbookDecidedTimeStatus> HandleAsync(
            UnbookDecidedTimeCommand command,
            CancellationToken cancellationToken = default
        )
        {
            var decidedTime = await context.DecidedTimes.FirstOrDefaultAsync(
                dt =>
                    dt.Id == command.DecidedTimeId
                    && (
                        dt.Kindergarten.Managers.Any(m => m.UserId == command.ManagerId)
                        || dt.SubstituteId == command.ManagerId
                    ),
                cancellationToken
            );

            if (decidedTime is null)
            {
                logger.LogWarning(
                    "DecidedTime with Id {DecidedTimeId} could be found for User {UserId}",
                    command.DecidedTimeId,
                    command.ManagerId
                );
                return UnbookDecidedTimeStatus.NotFound;
            }

            context.DecidedTimes.Remove(decidedTime);
            await context.SaveChangesAsync(cancellationToken);

            logger.LogInformation(
                "DecidedTime {DecidedTimeId} removed successfully",
                decidedTime.Id
            );
            return UnbookDecidedTimeStatus.Success;
        }
    }
}
