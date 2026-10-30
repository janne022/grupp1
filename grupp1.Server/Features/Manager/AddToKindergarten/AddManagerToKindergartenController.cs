using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.AddManagerToKindergarten.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.AddManagerToKindergarten;

[Authorize(Roles = "Manager")]
[Route("api/manager")]
[ApiController]
public class AddManagerToKindergartenController(
    IHandler<AddManagerToKindergartenCommand, AddManagerToKindergartenResult> handler
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

        var response = await handler.HandleAsync(command, cancellationToken);

        return response.Error switch
        {
            null => NoContent(),
            { Type: ErrorType.NotFound } error => NotFound(error),
            { Type: ErrorType.Conflict } error => Conflict(error),
            var error => BadRequest(error),
        };
    }
}