
using Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime.DTOs;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Infrastructure;
using Microsoft.AspNetCore.Authorization;

namespace Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime
{
    [Route("api/decidedtime")]
    [Authorize]
    [ApiController]
    public class UnbookDecidedTimeController (IHandler<UnbookDecidedTimeCommand, UnbookDecidedTimeResponse> handler) : ControllerBase
    {
        [HttpDelete("delete/{id:guid}")]
        public async Task<IActionResult> UnbookDecidedTime(Guid id, CancellationToken cancellationToken)
        {
            var command = new UnbookDecidedTimeCommand(id);

            var response = await handler.HandleAsync(command, cancellationToken);

            if (response.Status is UnbookDecidedTimeStatus.NotFound)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
