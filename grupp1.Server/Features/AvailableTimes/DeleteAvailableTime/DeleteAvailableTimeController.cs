using Vicaria.Server.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Vicaria.Server.Domain;
using System.Security.Claims;
using Vicaria.Server.Features.AvailableTimes.DeleteAvailableTime;

namespace Vicaria.Server.Features.AvailableTimes.Delete;

[Authorize(Roles = VicariaUserRoles.Substitute)]
[Route("api/availabletimes")]
[ApiController]
public class DeleteAvailableTimeController(
    IHandler<DeleteAvailableTimeCommand, DeleteAvailableTimeStatus> handler) : ControllerBase
{
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(
        [FromRoute(Name = "id")] Guid availableTimeId,
        CancellationToken cancellationToken
    )
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if(!Guid.TryParse(userId, out var substituteId))
        {
            return Unauthorized();
        }

        var command = new DeleteAvailableTimeCommand(availableTimeId, substituteId);
        

        var result = await handler.HandleAsync(command, cancellationToken);

        return result switch
        {
            DeleteAvailableTimeStatus.NotFound => NotFound(),
            DeleteAvailableTimeStatus.Success => NoContent(),
            _ => StatusCode(StatusCodes.Status500InternalServerError)
        };

    }
}

