
using Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime.DTOs;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Infrastructure;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using ErrorOr;

namespace Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime
{
    [Authorize]
    [Route("api/decided-times")]
    [ApiController]
    public class UnbookDecidedTimeController(IHandler<UnbookDecidedTimeCommand, ErrorOr<Deleted>> handler) : ControllerBase
    {
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> UnbookDecidedTime([FromRoute]Guid id, CancellationToken cancellationToken)
        {
            var userClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new UnbookDecidedTimeCommand(id, userId);

            ErrorOr<Deleted> response = await handler.HandleAsync(command, cancellationToken);

            return response.Match<IActionResult>
            (
                value => NoContent(),
                errors => this.ToProblem(errors)
            );
        }
    }
}
