using System.Security.Claims;
using ErrorOr;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.AddManagerToKindergarten.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.AddManagerToKindergarten;

[Authorize(Roles = "Manager")]
[Route("api/manager")]
[ApiController]
public class AddManagerToKindergartenController(
    IHandler<AddManagerToKindergartenCommand, ErrorOr<AddManagerToKindergartenResult>> handler
) : ControllerBase
{
    //This will be expanded upon later. right now any manager can go to any kindergarten they feel like
    [HttpPatch("addtokindergarten")]
    public async Task<IActionResult> AddToKindergarten(
        [FromQuery] Guid kindergartenId,
        CancellationToken cancellationToken = default
    )
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }
        var command = new AddManagerToKindergartenCommand(userId, kindergartenId);

        var result = await handler.HandleAsync(command, cancellationToken);

        return result.Match<IActionResult>(
            value => Ok(value),
            error => this.ToProblem(error)
        );

    }
}