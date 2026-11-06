using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.AvailableTimes.GetMy.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.AvailableTimes.GetMy
{
    [Route("api/available-times")]
    [Authorize]
    [ApiController]
    [Tags("AvailableTimes")]
    public class GetMyAvailableTimesController(
        IHandler<GetMyAvailableTimesQuery, GetMyAvailableTimesResponse> handler
    ) : ControllerBase
    {
        [HttpGet("{id:guid}")]
        public async Task<ActionResult<GetMyAvailableTimesResponse>> GetMy(
            [FromRoute(Name = "id")] Guid routeId,
            [FromQuery] DateTime? fromTime,
            [FromQuery] DateTime? toTime,
            CancellationToken cancellationToken
        )
        {
            if (fromTime >= toTime)
            {
                return BadRequest();
            }
            // Checking for logged in user is kinda more important, but I chose to
            // do time comparison first since it doesn't need hit the database.

            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized();
            }
            if (userId != routeId)
            {
                return Forbid();
            }

            var query = new GetMyAvailableTimesQuery(userId, fromTime, toTime);

            var response = await handler.HandleAsync(query, cancellationToken);

            return Ok(response);
        }
    }
}
