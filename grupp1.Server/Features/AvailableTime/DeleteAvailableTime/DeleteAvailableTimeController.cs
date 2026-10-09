using Vicaria.Server.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace Vicaria.Server.Features.AvailableTime.Delete;

[Route("api/availabletime")]
[ApiController]
public class DeleteAvailableTimeController(
    IHandler<DeleteAvailableTimeQuery, bool> handler) : ControllerBase
{
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(
        [FromRoute(Name = "id")] DeleteAvailableTimeQuery query,
        CancellationToken cancellationToken
    )
    {
        var FoundAndDeleted = await handler.HandleAsync(query, cancellationToken);

        if (!FoundAndDeleted)
            return NotFound();

        return NoContent();
    }
}

