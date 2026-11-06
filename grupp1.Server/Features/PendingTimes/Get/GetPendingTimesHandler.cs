using Microsoft.AspNetCore.Identity;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.PendingTimes.Get.DTOs;
using Vicaria.Server.Infrastructure;
using ErrorOr;
using Vicaria.Server.Domain;
using Microsoft.EntityFrameworkCore;

namespace Vicaria.Server.Features.PendingTimes.Get;

public class GetPendingTimesHandler(VicariaDbContext DbContext, UserManager<User> userManager)
    : IHandler<GetPendingTimesQuery, ErrorOr<GetPendingTimesResponse>>
{
    public async Task<ErrorOr<GetPendingTimesResponse>> HandleAsync(
        GetPendingTimesQuery query,
        CancellationToken cancellationToken = default
    )
    {
        User? currentUser = await userManager.FindByIdAsync(query.UserId.ToString());
        HashSet<string> currentRoles = [.. await userManager.GetRolesAsync(currentUser!)];

        IQueryable<PendingTime> databaseQuery = DbContext.PendingTimes;

        #region Query filters

        if (currentRoles.Contains(VicariaUserRoles.Manager))
        {
            databaseQuery = databaseQuery.Where(pendingTime => pendingTime.ManagerId == query.UserId);
        }
        else if (currentRoles.Contains(VicariaUserRoles.Substitute))
        {
            databaseQuery = databaseQuery.Where(pendingTime => pendingTime.AvailableSubs.Any(subsitute => subsitute.UserId == query.UserId));
        }

        if (query.FromTime is not null)
        {
            databaseQuery = databaseQuery.Where(pendingTime => pendingTime.StartTime >= query.FromTime.Value);
        }

        if (query.ToTime is not null)
        {
            databaseQuery = databaseQuery.Where(pendingTime => pendingTime.StartTime <= query.ToTime.Value);
        }

        if (query.IncludeBookedTimes is not true)
        {
            databaseQuery = databaseQuery.Where(pendingTime => !pendingTime.IsBooked);
        }

        #endregion

        PendingTimeDto[] filteredPendingTimes = await databaseQuery.Select(pendingTime => new PendingTimeDto
        (
            Id: pendingTime.Id,
            StartTime: pendingTime.StartTime,
            EndTime: pendingTime.EndTime,
            Kindergarten: new KindergartenDto
            (
                Id: pendingTime.Kindergarten.Id,
                Name: pendingTime.Kindergarten.Name,
                Latitude: pendingTime.Kindergarten.Location != null ? pendingTime.Kindergarten.Location.Y : null,
                Longitude: pendingTime.Kindergarten.Location != null ? pendingTime.Kindergarten.Location.X : null
            )
        )).ToArrayAsync();

        return new GetPendingTimesResponse(filteredPendingTimes);
    }
}
