
using Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime.DTOs;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Infrastructure;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime
{
    [Authorize(Roles = "MANAGER")]
    [Route("api/decidedtime")]
    [ApiController]
    public class UnbookDecidedTimeController (IHandler<UnbookDecidedTimeCommand, UnbookDecidedTimeResponse> handler) : ControllerBase
    {
        [HttpDelete("delete/{id:guid}")]
        public async Task<IActionResult> UnbookDecidedTime(Guid id, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(!Guid.TryParse(userId, out var userGuidId))
            {
                return Unauthorized();
            }

            var command = new UnbookDecidedTimeCommand(id, userGuidId);

            var response = await handler.HandleAsync(command, cancellationToken);

            if (response.Status is UnbookDecidedTimeStatus.NotFound)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
