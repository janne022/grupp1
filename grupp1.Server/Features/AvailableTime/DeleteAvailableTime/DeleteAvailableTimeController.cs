using grupp1.Server.Infrastructure;
using Microsoft.AspNetCore.Mvc;

namespace Vicaria.Server.Features.AvailableTime.Delete;

[Route("api/availabletime")]
[ApiController]
public class DeleteAvailableTimeController(
    IHandler<DeleteAvailableTimeRequest, bool> handler) : ControllerBase
{
    [HttpDelete("delete/{id}")]
    public async Task<IActionResult> Delete(
        [FromRoute(Name = "id")] DeleteAvailableTimeRequest request,
        CancellationToken cancellationToken
    )
    {
        var FoundAndDeleted = await handler.HandleAsync(request, cancellationToken);

        if (!FoundAndDeleted)
            return NotFound();

        return NoContent();
    }
}

