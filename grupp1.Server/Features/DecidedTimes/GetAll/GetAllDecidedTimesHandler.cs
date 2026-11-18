using ErrorOr;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.DecidedTimes.GetAll.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.GetAll;

public class GetAllDecidedTimesHandler(
    VicariaDbContext DbContext,
    UserManager<User> userManager
) : IHandler<GetAllDecidedTimesQuery, ErrorOr<GetAllDecidedTimesResponse>>
{
    public async Task<ErrorOr<GetAllDecidedTimesResponse>> HandleAsync(
        GetAllDecidedTimesQuery query,
        CancellationToken cancellationToken = default
    )
    {
        #region query filtering
        User? currentUser = await userManager.FindByIdAsync(query.Userid.ToString());
        HashSet<string> currentRoles = [.. await userManager.GetRolesAsync(currentUser!)];

        IQueryable<DecidedTime> dbQuery = DbContext.DecidedTimes.AsNoTracking();

        if (currentRoles.Contains(VicariaUserRoles.Manager))
        {
            dbQuery = dbQuery.Where(decidedTime => decidedTime.ManagerId == query.Userid);
        }
        else if (currentRoles.Contains(VicariaUserRoles.Substitute))
        {
            dbQuery = dbQuery.Where(decidedTime => decidedTime.SubstituteId == query.Userid);
        }

        if (query.FromTime is not null)
        {
            dbQuery = dbQuery.Where(decidedTime => decidedTime.StartTime >= query.FromTime.Value);
        }

        if (query.ToTime is not null)
        {
            dbQuery = dbQuery.Where(decidedTime => decidedTime.StartTime <= query.ToTime.Value);
        }

        if (query.KindergartenIds is not null && query.KindergartenIds.Length > 0)
        {
            dbQuery = dbQuery.Where(decidedTime => query.KindergartenIds.Contains(decidedTime.KindergartenId));
        }

        if (currentRoles.Contains(VicariaUserRoles.Manager))
        {
            dbQuery = dbQuery
                .Where(decidedTime => decidedTime.Kindergarten.Managers.Any(manager => manager.UserId == query.Userid)
            );
        }
        else if (currentRoles.Contains(VicariaUserRoles.Substitute))
        {
            dbQuery = dbQuery.Where(decidedTime => decidedTime.Kindergarten.AvailableSubs.Any(availableSub => availableSub.AvailableTime.UserId == query.Userid));
        }

        #endregion

        #region materialisation

        GetAllDecidedTimesDTO[] decidedTimes = await dbQuery
            .OrderBy(decidedTime => decidedTime.StartTime)
            .Select(decidedTime => new GetAllDecidedTimesDTO(
               DecidedTimeId: decidedTime.Id,
               StartTime: decidedTime.StartTime,
               EndTime: decidedTime.EndTime,

               SubstituteId: decidedTime.SubstituteId,
               SubstituteFirstName: decidedTime.Substitute.FirstName,
               SubstituteLastName: decidedTime.Substitute.LastName,

               KindergartenId: decidedTime.KindergartenId,
               KindergartenName: decidedTime.Kindergarten.Name
            ))
            .ToArrayAsync(cancellationToken);

        return new GetAllDecidedTimesResponse(decidedTimes);
        #endregion
    }
}