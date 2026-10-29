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

        var deletedTime = await dbContext.AvailableTimes.Where(at => at.Id == command.AvailableTimeId && at.UserId == command.SubstituteId).ExecuteDeleteAsync(cancellationToken);

        if(deletedTime == 0) //nothing to delete / not found
        {
            _logger.LogWarning("The availableTime {AvailableTimeId} could not be found", command.AvailableTimeId);
            return DeleteAvailableTimeStatus.NotFound;
        }

        return DeleteAvailableTimeStatus.Success;

        
    }
}