
using Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime.DTOs;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Infrastructure;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Vicaria.Server.Domain;

namespace Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime
{
    [Authorize(Roles = VicariaUserRoles.Manager)]
    [Route("api/decidedtime")]
    [ApiController]
    public class UnbookDecidedTimeController (IHandler<UnbookDecidedTimeCommand, UnbookDecidedTimeStatus> handler) : ControllerBase
    {
        [HttpDelete("delete/{id:guid}")]
        public async Task<IActionResult> UnbookDecidedTime(Guid id, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(!Guid.TryParse(userId, out var managerId))
            {
                return Unauthorized();
            }

            var command = new UnbookDecidedTimeCommand(id, managerId);

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
