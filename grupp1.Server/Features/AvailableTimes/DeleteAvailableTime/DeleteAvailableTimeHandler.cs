using Vicaria.Server.Features.AvailableTimes.DeleteAvailableTime;
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

        var availableTime = await dbContext.AvailableTimes.Where(at => at.Id == command.AvailableTimeId && at.UserId == command.SubstituteId, cancellationToken);

        if(availableTime is null)
        {
            _logger.LogWarning("The availableTime {AvailableTimeId} could not be found", command.AvailableTimeId);
            return DeleteAvailableTimeStatus.NotFound;
        }


        dbContext.AvailableTimes.Remove(availableTime);
        await dbContext.SaveChangesAsync(cancellationToken);

        return DeleteAvailableTimeStatus.Success;

        
    }
}