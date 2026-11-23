using ErrorOr;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Features.Account.AllSubstitutes.DTOs;
using Vicaria.Server.Features.Account.NameChange.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.Account.AllSubstitutes;

public class AllSubstitutesHandler(
    VicariaDbContext dbContext
) : IHandler<AllSubstitutesQuery, ErrorOr<AllSubstitutesResponse>>
{
    public async Task<ErrorOr<AllSubstitutesResponse>> HandleAsync(
        AllSubstitutesQuery query,
        CancellationToken cancellationToken = default
    )
    {
        var substituteRoleIds = dbContext.Roles
            .Where(r => r.NormalizedName == "SUBSTITUTE")
            .Select(r => r.Id);

        var Substitutes = await dbContext.Users
            .AsNoTracking()
            .Where(u => dbContext.UserRoles.Any(ur =>
                ur.UserId == u.Id && substituteRoleIds.Contains(ur.RoleId)))
            .Select(u => new AllSubstitutesDTO(
                u.Id,
                u.FirstName,
                u.LastName,
                u.PhoneNumber!,
                u.Email!
            ))
            .ToListAsync(cancellationToken);

        return new AllSubstitutesResponse(Substitutes);

    }
}