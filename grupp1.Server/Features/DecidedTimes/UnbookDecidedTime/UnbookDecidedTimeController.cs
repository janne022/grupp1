
using Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime.DTOs;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Infrastructure;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime
{
    [Authorize]
    [Route("api/decidedtime")]
    [ApiController]
    public class UnbookDecidedTimeController (IHandler<UnbookDecidedTimeCommand, UnbookDecidedTimeStatus> handler) : ControllerBase
    {
        [HttpDelete("delete/{id:guid}")]
        public async Task<IActionResult> UnbookDecidedTime([FromRoute]Guid id, CancellationToken cancellationToken)
        {
            var userClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(!Guid.TryParse(userClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new UnbookDecidedTimeCommand(id, userId);

            var response = await handler.HandleAsync(command, cancellationToken);

            return response switch
            {
                UnbookDecidedTimeStatus.NotFound => NotFound(),
                UnbookDecidedTimeStatus.Success => NoContent(),
                _ => StatusCode(StatusCodes.Status500InternalServerError)
            };
        }
    }
}
