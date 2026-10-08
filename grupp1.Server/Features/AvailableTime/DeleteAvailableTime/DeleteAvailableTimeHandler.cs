using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Infrastructure;
namespace Vicaria.Server.Features.AvailableTime.Delete;

public class DeleteAvailableTimeHandler(
    VicariaDbContext dbContext,
    ILogger<DeleteAvailableTimeHandler> _logger
) : IHandler<DeleteAvailableTimeQuery, bool>
{
    public async Task<bool> HandleAsync(
        DeleteAvailableTimeQuery query,
        CancellationToken cancellationToken = default)
    {
        var deletedTime = await dbContext.AvailableTimes
        .Where(at => at.Id == query.AvailableTimeId)
        .ExecuteDeleteAsync(cancellationToken);

        if (deletedTime == 0) //nothing to delete / not found
        {
            _logger.LogInformation($"AvailableTime {query.AvailableTimeId} not found");
            return false;
        }

        return true;
    }
}