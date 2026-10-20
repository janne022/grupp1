using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.AvailableTimes.GetAll.DTOs;
using Vicaria.Server.Infrastructure;

namespace grupp1.Server.Features.AvailableTimes.GetAll
{
    // TODO: Add Authorization tag when authorisation is up.
    [Route("api/availabletimes")]
    [ApiController]
    public class GetAllAvailableTimesController(IHandler<GetAllAvailableTimesQuery, GetAllAvailableTimesResponse> handler) : ControllerBase
    {
        [HttpGet()]
        public async Task<ActionResult<GetAllAvailableTimesResponse>> GetAll(CancellationToken ct)
        {
            var query = new GetAllAvailableTimesQuery(); // I love this so much <3
            // TODO: Add user to query when authorisation is up.

            var response = await handler.HandleAsync(query, ct);

            return Ok(response);
        }
    }
}
