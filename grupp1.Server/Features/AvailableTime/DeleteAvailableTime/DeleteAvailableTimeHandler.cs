using grupp1.Server.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Infrastructure;
namespace Vicaria.Server.Features.AvailableTime.Delete;

public class DeleteAvailableTimeHandler(
    VicariaDbContext dbContext,
    ILogger<DeleteAvailableTimeHandler> _logger
) : IHandler<DeleteAvailableTimeRequest, bool>
{
    public async Task<bool> HandleAsync(
        DeleteAvailableTimeRequest request,
        CancellationToken cancellationToken = default)
    {
        var deletedTime = await dbContext.AvailableTimes
        .Where(at => at.Id == request.AvailableTimeId)
        .ExecuteDeleteAsync(cancellationToken);

        if(deletedTime == 0) //nothing to delete / not found
        {
            _logger.LogInformation($"AvailableTime {request.AvailableTimeId} not found");
            return false;
        }

        return true;
    }
}