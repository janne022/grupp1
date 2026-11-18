using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Domain;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.AvailableTimes.GetByManager;

[Route("api/managers")] //uuuuuuuuuuuhhhhhhh maybe other folder? though that feels dumb
[Authorize(Roles = VicariaUserRoles.Manager)]
[ApiController]
[Tags("AvailableTimes")]
public class GetAllAvailableTimeByManagerController(
    IHandler<GetAllAvailableTimeByManagerQuery, GetAllAvailableTimeByManagerResponse> handler) : ControllerBase
{
    [HttpGet("{id:guid}/available-times")]
    public async Task<ActionResult<GetAllAvailableTimeByManagerResponse>> GetByManager(
        [FromRoute(Name = "id")] Guid routeId,
        CancellationToken cancellationToken = default
    )
    {
        var userClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userClaim, out var userId))
        {
            return Unauthorized();
        }
        if (userId != routeId)
        {
            return Forbid();
        }

        var query = new GetAllAvailableTimeByManagerQuery(userId);

        var response = await handler.HandleAsync(query, cancellationToken);

        return Ok(response);
    }
}