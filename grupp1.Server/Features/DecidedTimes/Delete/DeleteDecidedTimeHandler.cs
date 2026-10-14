using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.DecidedTimes.Delete.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.Delete
{
    public class DeleteDecidedTimeHandler(VicariaDbContext context, ILogger<DeleteDecidedTimeHandler> _logger) : IHandler<DeleteDecidedTimeCommand, bool>
    {
        public async Task<bool> HandleAsync(DeleteDecidedTimeCommand command, CancellationToken cancellationToken = default)
        {
            var decidedTime = await context.DecidedTimes.FirstOrDefaultAsync(dt => dt.Id == command.DecidedTimeId, cancellationToken);

            if (decidedTime is null)
            {
                return false;
            }

            context.DecidedTimes.Remove(decidedTime);

            context.AvailableTimes.Add(new AvailableTime
            {
                Id = Guid.NewGuid(), 
                StartTime = decidedTime.StartTime,
                EndTime = decidedTime.EndTime,
                UserId = decidedTime.UserId,
                //Kindergartens = ?  //DecidedTime doesnt contain Kindergartens, is this something we want to add?
            });
            await context.SaveChangesAsync(cancellationToken);

            return true;
        }
    }
}
