using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.AvailableTimes.GetMy.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.AvailableTimes.GetMy
{
    [Route("api/availabletimes")]
    [Authorize]
    [ApiController]
    public class GetMyAvailableTimesController(
        IHandler<GetMyAvailableTimesQuery, GetMyAvailableTimesResponse> handler
    ) : ControllerBase
    {
        [HttpGet()]
        public async Task<ActionResult<GetMyAvailableTimesResponse>> GetMy(
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

            var userClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            bool isGuid = Guid.TryParse(userClaim, out var userId);
            if (!isGuid)
            {
                return Unauthorized();
            }

            var query = new GetMyAvailableTimesQuery(userId, fromTime, toTime);

            var response = await handler.HandleAsync(query, cancellationToken);

            return Ok(response);
        }
    }
}
