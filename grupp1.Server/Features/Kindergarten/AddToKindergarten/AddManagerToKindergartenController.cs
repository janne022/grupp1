using System.Security.Claims;
using ErrorOr;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.Kindergarten.AddManagerToKindergarten.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.Kindergarten.AddManagerToKindergarten;

[Authorize(Roles = "Manager")]
[Route("api/kindergartens")]
[ApiController]
[Tags("Kindergarten")]
public class AddManagerToKindergartenController(
    IHandler<AddManagerToKindergartenCommand, ErrorOr<AddManagerToKindergartenResult>> handler
) : ControllerBase
{
    //TODO: right now any manager can add themselves to any kindergarten. this needs fixing but is good for testing
    [HttpPatch("{kindergartenId:guid}/managers/{managerId:guid}")]
    public async Task<IActionResult> AddToKindergarten(
        [FromRoute(Name = "kindergartenId")] Guid kindergartenId,
        [FromRoute(Name = "managerId")] Guid managerId,
        CancellationToken cancellationToken = default
    )
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }
        if (userId != managerId)
        {
            return Forbid();
        }

        var command = new AddManagerToKindergartenCommand(userId, kindergartenId);

        var result = await handler.HandleAsync(command, cancellationToken);

        return result.Match<IActionResult>(
            value => Ok(value),
            error => this.ToProblem(error)
        );

    }
}