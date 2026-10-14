using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Infrastructure;


namespace grupp1.Server.Features.AvailableTimes.Post
{
    [Route("api/availabletimes")]
    [ApiController]
    public class PostAvailableTimeController(IHandler<PostAvailableTimeRequest, PostAvailableTimeResponse> handler) : ControllerBase
    {

        [HttpPost]
        public async Task<ActionResult<PostAvailableTimeResponse>> PostAvailableTime(PostAvailableTimeRequest request, CancellationToken cancellationToken)
        {

            var response = await handler.HandleAsync(request, cancellationToken);

            if (!response.Success)
            {
                return BadRequest(response.ErrorMessage);
            }

            return Created($"/api/availabletimes/byid", response);


        }
    }
}
