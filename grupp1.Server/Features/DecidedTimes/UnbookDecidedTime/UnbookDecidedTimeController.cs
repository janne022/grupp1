
using Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime.DTOs;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.UnbookDecidedTime
{
    [Route("api/[controller]")]
    [ApiController]
    public class UnbookDecidedTimeController (IHandler<UnbookDecidedTimeCommand, UnbookDecidedTimeResponse> handler) : ControllerBase
    {
        // TODO: Add Authorization tag when authorisation is up.
        [HttpDelete("{id:guid}")]
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
