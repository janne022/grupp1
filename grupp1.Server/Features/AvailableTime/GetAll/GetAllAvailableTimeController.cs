using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.AvailableTime.GetAll.DTOs;

namespace grupp1.Server.Features.AvailableTime.GetAll
{
    // TODO: Add Authorization tag when authorisation is up.
    [Route("api/availabletime")]
    [ApiController]
    public class GetAllAvailableTimeController(GetAllAvailableTimeHandler handler) : ControllerBase
    {
        [HttpGet("getall")]
        public async Task<ActionResult<GetAllAvailableTimesResponse>> GetAll(CancellationToken ct)
        {
            var query = new GetAllAvailableTimesQuery(); // I love this so much <3
            // TODO: Add user to query when authorisation is up.

            var response = await handler.HandleAsync(query, ct);

            return Ok(response);
        }
    }
}
