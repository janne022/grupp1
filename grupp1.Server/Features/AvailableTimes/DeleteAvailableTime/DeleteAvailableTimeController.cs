using Vicaria.Server.Infrastructure;
using Vicaria.Server.Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Vicaria.Server.Domain;
using System.Security.Claims;

namespace Vicaria.Server.Features.AvailableTimes.Delete;

[Authorize(Roles = VicariaUserRoles.Substitute)]
[Route("api/availabletimes")]
[Authorize]
[ApiController]
public class DeleteAvailableTimeController(
    IHandler<DeleteAvailableTimeCommand, DeleteAvailableTimeStatus> handler) : ControllerBase
{
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(
        [FromRoute(Name = "id")] string id,
        CancellationToken cancellationToken
    )
    {
        ArgumentNullException.ThrowIfNullOrEmpty(id);
        
        string? userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null || !Guid.TryParse(id, out var guidFormattedId) || !Guid.TryParse(userId, out var userGuidId))
        {
            return BadRequest();
        }

        DeleteAvailableTimeCommand command = new(guidFormattedId, userGuidId);
        DeleteAvailableTimeStatus result = await handler.HandleAsync(command, cancellationToken);

        return result switch
        {
            DeleteAvailableTimeStatus.NotFound => NotFound(),
            DeleteAvailableTimeStatus.Success => NoContent(),
            _ => StatusCode(StatusCodes.Status500InternalServerError)
        };
    }
}

