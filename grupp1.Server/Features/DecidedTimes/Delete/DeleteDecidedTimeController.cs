using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.DecidedTimes.Delete.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.Delete
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeleteDecidedTimeController (IHandler<DeleteDecidedTimeCommand, bool> handler) : ControllerBase
    {
        // TODO: Add Authorization tag when authorisation is up.
        [HttpDelete]
        [Route("delete/{id:guid}")]
        public async Task<IActionResult> DeleteDecidedTime(DeleteDecidedTimeCommand command, CancellationToken cancellationToken)
        {
            var FoundAndDeleted = await handler.HandleAsync(command, cancellationToken);

            if (!FoundAndDeleted)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
