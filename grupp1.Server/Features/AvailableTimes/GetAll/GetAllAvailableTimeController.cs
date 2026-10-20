using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.AvailableTimes.GetAll.DTOs;
using Vicaria.Server.Infrastructure;

namespace grupp1.Server.Features.AvailableTimes.GetAll
{
    [Route("api/availabletimes")]
    [Authorize]
    [ApiController]
    public class GetAllAvailableTimesController(IHandler<GetAllAvailableTimesQuery, GetAllAvailableTimesResponse> handler) : ControllerBase
    {
        [HttpGet()]
        public async Task<ActionResult<GetAllAvailableTimesResponse>> GetAll(CancellationToken ct)
        {
            var userClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            bool isGuid = Guid.TryParse(userClaim, out var userId);
            if (isGuid == false)
            {
                return Unauthorized();
            }

            var query = new GetAllAvailableTimesQuery(); // I love this so much <3

            var response = await handler.HandleAsync(query, ct);

            return Ok(response);
        }
    }
}
