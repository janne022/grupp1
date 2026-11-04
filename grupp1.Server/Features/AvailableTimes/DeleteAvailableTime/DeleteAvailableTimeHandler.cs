using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Infrastructure;
namespace Vicaria.Server.Features.AvailableTimes.Delete;

public class DeleteAvailableTimeHandler(
    VicariaDbContext dbContext,
    ILogger<DeleteAvailableTimeHandler> _logger
) : IHandler<DeleteAvailableTimeCommand, DeleteAvailableTimeStatus>
{
        public async Task<DeleteAvailableTimeStatus> HandleAsync(
            DeleteAvailableTimeCommand command,
            CancellationToken cancellationToken = default)
        {
                int deletedTime = await dbContext.AvailableTimes
                .Where(at => at.Id == command.AvailableTimeId)
                .ExecuteDeleteAsync(cancellationToken);

                if (deletedTime is 0)
                {
                        _logger.LogWarning("The availableTime {AvailableTimeId} could not be found", command.AvailableTimeId);
                        return DeleteAvailableTimeStatus.NotFound;
                }

                return DeleteAvailableTimeStatus.Success;
        }
}