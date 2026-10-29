using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.DecidedTimes.GetById.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.GetById;

public class GetDecidedTimeByIdHandler(
    VicariaDbContext dbContext,
    ILogger<GetDecidedTimeByIdHandler> _logger
) : IHandler<GetDecidedTimeByIdQuery, GetDecidedTimeByIdResponse?>
{
    public async Task<GetDecidedTimeByIdResponse?> HandleAsync(
        GetDecidedTimeByIdQuery query,
        CancellationToken cancellationToken = default)
    {   
        _logger.LogInformation("Starting to find DecidedTime {DecidedTimeId}", query.DecidedTimeGuid);

        var decidedTime = await dbContext.DecidedTimes
            .AsNoTracking()
            .Where(dt => dt.Kindergarten.Managers
            .Any(m => m.UserId == query.UserId) || dt.UserId == query.UserId)
            .Include(dt => dt.User)
            .Include(dt => dt.Kindergarten)
            .SingleOrDefaultAsync(dt => dt.Id == query.DecidedTimeGuid, cancellationToken);
        

        if (decidedTime is null)
        {
            _logger.LogWarning("DecidedTime id: {DecidedTimeId} not found", query.DecidedTimeGuid);
            return null;
        }

        GetDecidedTimeByIdResponse response = new(
            Id: decidedTime.Id,
            StartTime: decidedTime.StartTime,
            EndTime: decidedTime.EndTime,

            SubstituteInfo: new SubstituteDTO(
                Id: decidedTime.UserId,
                FirstName: decidedTime.User.FirstName,
                LastName: decidedTime.User.LastName
            ),
            KindergartenInfo: new KindergartenDTO(
                Id: decidedTime.KindergartenId,
                Name: decidedTime.Kindergarten.Name,
                Latitude: decidedTime.Kindergarten.Location?.Y,
                Longitude: decidedTime.Kindergarten.Location?.X
            )
        );

        _logger.LogInformation("Successfully found DecidedTime ID: {DecidedTimeId}", query.DecidedTimeGuid);

        return response;
    }
}