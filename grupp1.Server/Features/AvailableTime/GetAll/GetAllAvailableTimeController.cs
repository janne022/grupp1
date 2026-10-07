using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.AvailableTime.GetAll.DTOs;

namespace grupp1.Server.Features.AvailableTime.GetAll
{
    [Route("api/availabletime")]
    [ApiController]
    public class GetAllAvailableTimeController(GetAllAvailableTimeHandler handler) : ControllerBase
    {
        [HttpGet("getall")]
        public async Task<ActionResult<GetAllAvailableTimesResponse>> GetAll(CancellationToken ct)
        {
            var request = new GetAllAvailableTimesRequest(); // I love this so much <3

            var response = await handler.HandleAsync(request, ct);

            return Ok(response);
        }
    }
}
