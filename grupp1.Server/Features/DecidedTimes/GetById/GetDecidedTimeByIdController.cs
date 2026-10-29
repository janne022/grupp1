
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vicaria.Server.Features.DecidedTimes.GetById.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.GetById;

[Authorize]
[Route("api/decidedtime")]
[Authorize]
[ApiController]
public class GetDecidedTimeByIdController(
    IHandler<GetDecidedTimeByIdQuery, GetDecidedTimeByIdResponse> handler
) : ControllerBase
{
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<GetDecidedTimeByIdResponse>> GetById(
    [FromRoute] Guid id,
    CancellationToken cancellationToken = default)
    {
        var userClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if(!Guid.TryParse(userClaim, out var userId))
        {
            return Unauthorized();
        }

        var query = new GetDecidedTimeByIdQuery
        (
            id,
            userId
        );

        var result = await handler.HandleAsync(query, cancellationToken);

        if(result is null)
        {
            return NotFound();
        }

        return Ok(result);

    }
}