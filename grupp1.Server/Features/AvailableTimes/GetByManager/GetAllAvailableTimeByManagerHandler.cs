using System.Data;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.AvailableTimes.GetByManager;

public class GetAllAvailableTimeByManagerHandler(
    VicariaDbContext dbContext
) : IHandler<GetAllAvailableTimeByManagerQuery, GetAllAvailableTimeByManagerResponse>
{
    public async Task<GetAllAvailableTimeByManagerResponse> HandleAsync(
    GetAllAvailableTimeByManagerQuery query,
    CancellationToken cancellationToken = default)
    {
        var kindergartens = await dbContext.Kindergartens
            .Where(k => k.Managers.Any(m => m.UserId == query.ManagerId))
            .Select(k => new AvailableTimesByKindergartenDTO(
                k.Id,
                k.Name,
                k.AvailableSubs
                    .Select(ka => new AvailableTimesByManagerDTO(
                        ka.AvailableTime.Id,
                        ka.AvailableTime.StartTime,
                        ka.AvailableTime.EndTime,
                        ka.AvailableTime.Substitute.FirstName,
                        ka.AvailableTime.Substitute.LastName))
                    .ToArray()))
            .ToArrayAsync(cancellationToken);

        return new GetAllAvailableTimeByManagerResponse(kindergartens);
    }
}