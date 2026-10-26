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
    public class GetMyAvailableTimesController(IHandler<GetMyAvailableTimesQuery, GetMyAvailableTimesResponse> handler) : ControllerBase
    {
        [HttpGet()]
        public async Task<ActionResult<GetMyAvailableTimesResponse>> GetMy(CancellationToken ct)
        {
            var userClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            bool isGuid = Guid.TryParse(userClaim, out var userId);
            if (!isGuid)
            {
                return Unauthorized();
            }

            var query = new GetMyAvailableTimesQuery(userId);

            var response = await handler.HandleAsync(query, ct);

            return Ok(response);
        }
    }
}
