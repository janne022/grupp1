using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vicaria.Server.Infrastructure;


namespace grupp1.Server.Features.AvailableTimes.Post
{
    [Authorize(Roles = "Substitute")]
    [Route("api/availabletimes")]
    [ApiController]
    public class PostAvailableTimeController(IHandler<PostAvailableTimeRequest, PostAvailableTimeResponse> handler) : ControllerBase
    {

        [HttpPost]
        public async Task<ActionResult<PostAvailableTimeResponse>> PostAvailableTime(PostAvailableTimeRequest request, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(!Guid.TryParse(userId, out var userGuidId)) 
            {
                return Unauthorized();
            }

            var newRequest = new PostAvailableTimeRequest
            {
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                Kindergartens = request.Kindergartens,
                UserId = userGuidId
            };

            var response = await handler.HandleAsync(newRequest, cancellationToken);

            if (!response.Success)
            {
                return BadRequest(response.ErrorMessage);
            }

            return Created($"/api/availabletimes/byid", response);


        }
    }
}
