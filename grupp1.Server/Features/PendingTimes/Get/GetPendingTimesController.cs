using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.PendingTimes.Get.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.PendingTimes.Get
{
    [Route("api/Pendingtimes")]
    [Authorize]
    [ApiController]
    public class GetPendingTimesController(
        IHandler<GetPendingTimesQuery, GetPendingTimesResponse> handler
    ) : ControllerBase
    {
        [HttpGet()]
        public async Task<ActionResult<GetPendingTimesResponse>> GetPendingTimes(
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

            var query = new GetPendingTimesQuery(userId, fromTime, toTime);

            var response = await handler.HandleAsync(query, cancellationToken);

            return Ok(response);
        }
    }
}
