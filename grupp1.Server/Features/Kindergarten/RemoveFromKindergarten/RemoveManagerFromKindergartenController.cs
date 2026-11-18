using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.Kindergarten.RemoveManagerFromKindergarten.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.Kindergarten.RemoveManagerFromKindergarten;

[Authorize(Roles = "Manager")]
[Route("api/kindergartens")]
[ApiController]
[Tags("Kindergarten")]
public class RemoveManagerFromKindergartenController(
    IHandler<RemoveManagerFromKindergartenCommand, RemoveManagerFromKindergartenResult> handler
) : ControllerBase
{
    //TODO: do the same as the todo in  ADdMangerTOKindergarten file. Should the managers be able to leave on their own?
    [HttpDelete("{kindergartenId:guid}/managers/{managerId:guid}")]
    public async Task<IActionResult> RemoveFromKindergarten(
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


        var command = new RemoveManagerFromKindergartenCommand(userId, kindergartenId);

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