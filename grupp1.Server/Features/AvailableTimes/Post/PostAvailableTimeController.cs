using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

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

            return Ok(response);
        }
    }
}
