using Vicaria.Server.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Vicaria.Server.Features.AvailableTimes.Delete;

[Route("api/availabletimes")]
[Authorize(Roles = "Substitute")]
[ApiController]
public class DeleteAvailableTimeController(
    IHandler<DeleteAvailableTimeQuery, bool> handler,
    ILogger<DeleteAvailableTimeController> _logger) : ControllerBase
{
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(
        [FromRoute(Name = "id")] string id,
        CancellationToken cancellationToken
    )
    {
        ArgumentNullException.ThrowIfNullOrEmpty(id);

        if (!Guid.TryParse(id, out var guidFormattedId))
        {
            return BadRequest("id was not a GUID.");
        }

        DeleteAvailableTimeQuery query = new(guidFormattedId);

        bool FoundAndDeleted = await handler.HandleAsync(query, cancellationToken);

        if (!FoundAndDeleted)
            return NotFound();

        return NoContent();
    }
}

