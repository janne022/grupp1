using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Domain;
using ErrorOr;
using Vicaria.Server.Infrastructure;
using System.Security.Claims;

namespace Vicaria.Server.Features.PendingTimes.Delete;

#region Controller
[ApiController]
[Authorize(Roles = VicariaUserRoles.Substitute)]
[Route("api/pending-times")]
public sealed class RemoveCurrentUserController : ControllerBase
{
    private readonly IHandler<RemoveCurrentUserCommand, ErrorOr<RemoveCurrentUserResponse>> _handler;
    public RemoveCurrentUserController(IHandler<RemoveCurrentUserCommand, ErrorOr<RemoveCurrentUserResponse>> handler)
    {
        _handler = handler;
    }

    [HttpDelete(Name = "current-user")]
    public async Task<ActionResult<RemoveCurrentUserResponse>> RemoveCurrentUser()
    {
       string? substituteIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

       if(!Guid.TryParse(substituteIdClaim, out Guid substituteId))
        {
            return Unauthorized();
        }

        RemoveCurrentUserCommand command = new(substituteId);

        ErrorOr<RemoveCurrentUserResponse> response = await _handler.HandleAsync(command);

        return response.Match<ActionResult<RemoveCurrentUserResponse>>
        (
            value => Ok(value),
            errors => this.ToProblem(errors)
        );
    }
}
#endregion
#region Handler
public class RemoveCurrentUserHandler : IHandler<RemoveCurrentUserCommand, ErrorOr<RemoveCurrentUserResponse>>
{
    public async Task<ErrorOr<RemoveCurrentUserResponse>> HandleAsync(RemoveCurrentUserCommand request, CancellationToken cancellationToken = default)
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

public record class RemoveCurrentUserCommand
(
    Guid UserId
);

public record class KindergartenDto();

public record class SubstituteDto();
#endregion