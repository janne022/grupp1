using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.DecidedTimes.GetById.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.GetById;

public class GetDecidedTimeByIdHandler(
    VicariaDbContext dbContext,
    ILogger<GetDecidedTimeByIdHandler> _logger
) : IHandler<GetDecidedTimeByIdQuery, GetDecidedTimeByIdResponse>
{
    public async Task<GetDecidedTimeByIdResponse> HandleAsync(
        GetDecidedTimeByIdQuery query,
        CancellationToken cancellationToken = default)
    {   
        _logger.LogInformation("Starting to find DecidedTime {DecidedTimeId}", query.DecidedTimeGuid);

        var decidedTime = await dbContext.DecidedTimes
            .Include(at => at.User)
            .Include(at => at.Kindergarten)
            .SingleOrDefaultAsync(at => at.Id == query.DecidedTimeGuid);

        if (decidedTime == null)
        {
            _logger.LogWarning("DecidedTime id: {DecidedTimeId} not found", query.DecidedTimeGuid);
            throw new KeyNotFoundException($"DecidedTime time {query.DecidedTimeGuid} was not found.");
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
                Location: decidedTime.Kindergarten.Location
            )
        );

        _logger.LogInformation("Successfully found DecidedTime ID: {DecidedTimeId}", query.DecidedTimeGuid);

        return response;
    }
}