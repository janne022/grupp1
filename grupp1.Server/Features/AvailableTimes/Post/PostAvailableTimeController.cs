using Microsoft.AspNetCore.Mvc;

namespace grupp1.Server.Features.AvailableTimes.Post
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostAvailableTimeController(PostAvailableTimeHandler handler) : ControllerBase
    {

        [HttpPost]
        public async Task<ActionResult<PostAvailableTimeResponse>> PostAvailableTime(PostAvailableTimeRequest request, CancellationToken cancellationToken)
        {

            var response = await handler.HandleAsync(request, cancellationToken);

            if (!response.Success)
            {
                return BadRequest(response.ErrorMessage);
            }

            return Created($"/api/availabletime/getbytimeid", response);

        }
    }
}
