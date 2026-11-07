using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Domain;
using ErrorOr;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.PendingTimes.Patch;

#region Controller
[ApiController]
[Authorize(Roles = VicariaUserRoles.Substitute)] // So only Substitutes can remove themselves
[Route("api/pending-times")]
public sealed class RemoveCurrentUserController : ControllerBase
{
    public RemoveCurrentUserController()
    {

    }

    [HttpPatch(Name = "current-user")]
    public async Task<ErrorOr<ActionResult<RemoveCurrentUserResponse>>> RemoveCurrentUser()
    {
        throw new NotImplementedException();
    }
}
#endregion
#region Handler
public class RemoveCurrentUserHandler : IHandler<RemoveCurrentUserQuery, ErrorOr<RemoveCurrentUserResponse>>
{
    public async Task<ErrorOr<RemoveCurrentUserResponse>> HandleAsync(RemoveCurrentUserQuery request, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }
}
#endregion
#region DTOs
public record class RemoveCurrentUserResponse
(
    Guid Id,
    DateTime StartTime,
    DateTime EndTime,
    KindergartenDto Kindergarten,
    SubstituteDto[] Substitutes
);

public record class RemoveCurrentUserQuery
(
    Guid UserId
);

public record class KindergartenDto();

public record class SubstituteDto();
#endregion