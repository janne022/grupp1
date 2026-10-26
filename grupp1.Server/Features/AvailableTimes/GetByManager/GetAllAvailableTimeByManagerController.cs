using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.AvailableTimes.GetByManager;

[Route("api/availabletimes")]
[Authorize(Roles = "Manager")]
[ApiController]
public class GetAllAvailableTimeByManagerController(
    IHandler<GetAllAvailableTimeByManagerQuery, GetAllAvailableTimeByManagerResponse> handler) : ControllerBase
{
    [HttpGet("bymanager")]
    public async Task<ActionResult<GetAllAvailableTimeByManagerResponse>> GetByManager(
        CancellationToken cancellationToken = default
    )
    {
        var userClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userClaim, out var userId))
        {
            return Unauthorized();
        }

        var query = new GetAllAvailableTimeByManagerQuery(userId);

        var response = await handler.HandleAsync(query, cancellationToken);

        return Ok(response);
    }
}