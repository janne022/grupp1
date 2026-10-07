using grupp1.Server.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace Vicaria.Server.Features.AvailableTime.Delete;

[Route("api/availabletime")]
[ApiController]
public class DeleteAvailableTimeController(
    IHandler<DeleteAvailableTimeQuery, bool> handler) : ControllerBase
{
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(
        [FromRoute(Name = "id")] DeleteAvailableTimeQuery request,
        CancellationToken cancellationToken
    )
    {
        var FoundAndDeleted = await handler.HandleAsync(request, cancellationToken);

        if (!FoundAndDeleted)
            return NotFound();

        return NoContent();
    }
}

