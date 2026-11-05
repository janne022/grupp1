using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vicaria.Server.Domain;
using Vicaria.Server.Infrastructure;


namespace Vicaria.Server.Features.AvailableTimes.Post
{
    [Route("api/available-times")]
    [Authorize(Roles = VicariaUserRoles.Substitute)]
    [ApiController]
    public class PostAvailableTimeController(IHandler<PostAvailableTimeCommand, PostAvailableTimeResponse> handler) : ControllerBase
    {

        [HttpPost]
        public async Task<ActionResult<PostAvailableTimeResponse>> PostAvailableTime([FromBody] PostAvailableTimeRequest request, CancellationToken cancellationToken)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userId, out var userGuidId))
            {
                return Unauthorized();
            }

            var command = new PostAvailableTimeCommand
            {
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                Kindergartens = request.Kindergartens,
                SubstituteId = userGuidId
            };

            var response = await handler.HandleAsync(command, cancellationToken);

            return response.Status switch
            {
                PostAvailableTimeStatus.Ok => Created($"/api/availabletimes/{response.Id}", response.Id),
                PostAvailableTimeStatus.NotFound => NotFound(response.ErrorMessage),
                PostAvailableTimeStatus.Conflict => Conflict(response.ErrorMessage),
                PostAvailableTimeStatus.BadRequest => BadRequest(response.ErrorMessage),
                _ => StatusCode(StatusCodes.Status500InternalServerError)
            };

        }
    }
}
