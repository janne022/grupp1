using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.DecidedTimes.GetAll.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.GetAll;

public class GetAllDecidedTimesHandler(
    VicariaDbContext DbContext,
    ILogger<GetAllDecidedTimesHandler> _logger
) : IHandler<GetAllDecidedTimesQuery, GetAllDecidedTimesResponse>
{
    public async Task<GetAllDecidedTimesResponse> HandleAsync(
        GetAllDecidedTimesQuery query,
        CancellationToken cancellationToken = default
    )
    {
        #region Pre-run checks

        if (query.KindergartenIds is null || query.KindergartenIds.Length <= 0)
        {
            _logger.LogWarning(
                "KindergartenIds was null or empty on UserId {UserId} request "
                    + "in GetAllDecidedTimesHandler",
                query.ManagerId
            );

            return new GetAllDecidedTimesResponse(
                [],
                GetAllDecidedTimesStatus.NoKindergartensSpecified
            );
        }

        bool hasFromTime = false;
        if (query.FromTime is not null)
        {
            hasFromTime = true;
        }

        bool hasToTime = false;
        if (query.ToTime is not null)
        {
            hasToTime = true;
        }

        #endregion
        #region Belonging check

        var managedKindergartenIds = await DbContext
            .UserKinderGartens.Where(uk => uk.UserId == query.ManagerId)
            .Select(uk => uk.KindergartenId)
            .ToListAsync(cancellationToken);

        bool managesThemAll = true;
        foreach (var IdFromQuery in query.KindergartenIds)
        {
            bool managesCurrentKindergarten = managedKindergartenIds.Contains(IdFromQuery);

            if (!managesCurrentKindergarten)
            {
                managesThemAll = false;
                break;
            }
        }

        if (!managesThemAll)
        {
            _logger.LogWarning(
                "KindergartenIds {KinderIds} did not all belong to "
                    + "UserId {UserId} in GetAllDecidedTimesHandler",
                query.KindergartenIds,
                query.ManagerId
            );
            return new GetAllDecidedTimesResponse(
                [],
                GetAllDecidedTimesStatus.NotManagerOfKindergarten
            );
        }

        #endregion
        #region Get data

        var relevantTimes = DbContext.DecidedTimes.Where(dt =>
            query.KindergartenIds.Contains(dt.KindergartenId)
        );

        if (hasFromTime)
        {
            relevantTimes = relevantTimes.Where(dt => dt.StartTime >= query.FromTime!.Value);
        }

        if (hasToTime)
        {
            relevantTimes = relevantTimes.Where(dt => dt.StartTime <= query.ToTime!.Value);
        }

        var decidedTimes = await relevantTimes
            .OrderBy(dt => dt.StartTime)
            .Select(dt => new GetAllDecidedTimesDTO(
                dt.Id,
                dt.StartTime,
                dt.EndTime,
                dt.UserId,
                dt.User.FirstName,
                dt.User.LastName,
                dt.KindergartenId,
                dt.Kindergarten.Name
            ))
            .ToListAsync(cancellationToken);

        return new GetAllDecidedTimesResponse(decidedTimes, GetAllDecidedTimesStatus.Ok);

        #endregion
    }
}
