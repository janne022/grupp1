
using Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime.DTOs;
using Vicaria.Server.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime
{
    public class UnbookDecidedTimeHandler(VicariaDbContext context, ILogger<UnbookDecidedTimeHandler> logger) : IHandler<UnbookDecidedTimeCommand, UnbookDecidedTimeResponse>
    {
        public async Task<UnbookDecidedTimeResponse> HandleAsync(UnbookDecidedTimeCommand command, CancellationToken cancellationToken = default)
        {

            var decidedTime = await context.DecidedTimes.FirstOrDefaultAsync(dt => dt.Id == command.DecidedTimeId && 
                                                                             dt.Kindergarten.Managers.Any(m => m.UserId == command.ManagerId),  cancellationToken);

            if (decidedTime is null)
            {
                logger.LogInformation("No booking with Id {DecidedTimeId} could be found", command.DecidedTimeId);
                return new UnbookDecidedTimeResponse
                    (
                        UnbookDecidedTimeStatus.NotFound
                    );
            }


            context.DecidedTimes.Remove(decidedTime);
            await context.SaveChangesAsync(cancellationToken);

            logger.LogInformation("Booking {DecidedTimeId} removed successfully", decidedTime.Id);
            return new UnbookDecidedTimeResponse
                (
                    UnbookDecidedTimeStatus.Ok
                );
                
        }
    }
}
