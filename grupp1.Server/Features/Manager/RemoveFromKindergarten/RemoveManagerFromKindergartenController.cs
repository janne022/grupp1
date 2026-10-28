using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.RemoveManagerFromKindergarten.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.RemoveManagerFromKindergarten;

[Authorize(Roles = "Manager")]
[Route("api/manager")]
[ApiController]
public class RemoveManagerFromKindergartenController(
    IHandler<RemoveManagerFromKindergartenCommand, RemoveManagerFromKindergartenResult> handler
) : ControllerBase
{
    [HttpDelete("remove-from-kindergarten")]
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
        var command = new RemoveManagerFromKindergartenCommand(userId, kindergartenId);

        var response = await handler.HandleAsync(command, cancellationToken);

        if (response.Succeeded)
            return NoContent();


        return BadRequest(response.Error);
    }
}