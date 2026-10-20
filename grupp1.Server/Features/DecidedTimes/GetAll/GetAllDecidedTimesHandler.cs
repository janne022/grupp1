using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.DecidedTimes.GetAll.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.GetAll;

public class GetAllDecidedTimesHandler(
    VicariaDbContext DbContext//,
    // ILogger<GetAllDecidedTimesHandler> _logger
    //
    // TODO: uncomment above when logging is necessary
) : IHandler<GetAllDecidedTimesQuery, GetAllDecidedTimesResponse>
{
    public async Task<GetAllDecidedTimesResponse> HandleAsync(
        GetAllDecidedTimesQuery query,
        CancellationToken cancellationToken = default
    )
    {
        var decidedTimes = await DbContext
            .DecidedTimes.Select(dt => new GetAllDecidedTimesDTO(
                dt.Id,
                dt.StartTime,
                dt.EndTime,
                dt.KindergartenId,
                dt.Kindergarten.Name
                // TODO: Add the sub User here once we have authorisation
            ))
            .ToListAsync(cancellationToken);

        return new GetAllDecidedTimesResponse(decidedTimes);
    }
}
