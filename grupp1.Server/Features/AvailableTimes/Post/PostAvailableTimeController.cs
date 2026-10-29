using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vicaria.Server.Domain;
using Vicaria.Server.Infrastructure;


namespace Vicaria.Server.Features.AvailableTimes.Post
{
    [Route("api/availabletimes")]
    [Authorize(Roles = VicariaUserRoles.Substitute)]
    [ApiController]
    public class PostAvailableTimeController(IHandler<PostAvailableTimeCommand, PostAvailableTimeResponse> handler) : ControllerBase
    {

        [HttpPost]
        public async Task<ActionResult<PostAvailableTimeResponse>> PostAvailableTime([FromBody] PostAvailableTimeRequest request, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if(!Guid.TryParse(userId, out var userGuidId)) 
            {
                return Unauthorized();
            }

            var command = new PostAvailableTimeCommand
            {
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                Kindergartens = request.Kindergartens,
                UserId = userGuidId
            };

            var response = await handler.HandleAsync(command, cancellationToken);

            if (!response.Success)
            {
                return BadRequest(response.ErrorMessage);
            }

            return Created($"/api/availabletimes/byid", response);


        }
    }
}
