using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.PendingTimes.GetMy.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.PendingTimes.GetMy
{
    [Route("api/Pendingtimes")]
    [Authorize]
    [ApiController]
    public class GetMyPendingTimesController(
        IHandler<GetMyPendingTimesQuery, GetMyPendingTimesResponse> handler
    ) : ControllerBase
    {
        [HttpGet()]
        public async Task<ActionResult<GetMyPendingTimesResponse>> GetMy(
            [FromQuery] DateTime? fromTime,
            [FromQuery] DateTime? toTime,
            CancellationToken cancellationToken
        )
        {
            if (fromTime >= toTime)
            {
                return BadRequest();
            }

            var userClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            bool isGuid = Guid.TryParse(userClaim, out var userId);
            if (!isGuid)
            {
                return Unauthorized();
            }

            var query = new GetMyPendingTimesQuery(userId, fromTime, toTime);

            var response = await handler.HandleAsync(query, cancellationToken);

            return Ok(response);
        }
    }
}
