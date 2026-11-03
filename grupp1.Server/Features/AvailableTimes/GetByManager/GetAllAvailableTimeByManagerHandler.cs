using System.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.GetByManager.DTOs;
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
                        new UserInfoResponse(
                            ka.AvailableTime.Substitute.Id,
                            ka.AvailableTime.Substitute.FirstName,
                            ka.AvailableTime.Substitute.LastName,
                            ka.AvailableTime.Substitute.Email,
                            dbContext.UserRoles
                                .Where(ur => ur.UserId == ka.AvailableTime.Substitute.Id)
                                .Join(
                                    dbContext.Roles,
                                    ur => ur.RoleId,
                                    r => r.Id,
                                    (ur, r) => r.Name!
                                )
                                .ToArray(),
                            ka.AvailableTime.Substitute.PhoneNumber ?? string.Empty
                        )
                    ))
                    .ToArray()
            ))
            .ToArrayAsync(cancellationToken);

        return new GetAllAvailableTimeByManagerResponse(kindergartens);
    }
}