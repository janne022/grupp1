using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Domain;
using Vicaria.Server.Features.AvailableTimes.Update.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.AvailableTimes.Update
{
    [Route("api/availabletimes")]
    [Authorize(Roles = VicariaUserRoles.Substitute)]
    [ApiController]
    public class UpdateAvailableTimeController(
        IHandler<UpdateAvailableTimeCommand, UpdateAvailableTimeResponse> handler,
        ILogger<UpdateAvailableTimeController> logger
    ) : ControllerBase
    {
        [HttpPut()]
        public async Task<ActionResult<UpdateAvailableTimeResponse>> Update(
            [FromBody] UpdateAvailableTimeQuery query,
            CancellationToken cancellationToken
        )
        {
            var userClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new UpdateAvailableTimeCommand(
                query.TimeId,
                query.StartTime,
                query.EndTime,
                userId
            );

            var response = await handler.HandleAsync(command, cancellationToken);

            return response.StatusMessage switch
            {
                UpdateAvailableTimeStatus.Ok => Ok(response),
                UpdateAvailableTimeStatus.BadTime => BadRequest(response),
                UpdateAvailableTimeStatus.WasNull => NotFound(response),
                UpdateAvailableTimeStatus.NotOwner => Forbid(),
                _ => UnknownError(command.TimeId),
            };
        }

        private ActionResult UnknownError(Guid timeId)
        {
            logger.LogError("Reached unknown error when looking for {TimeId}", timeId);
            return Problem();
        }
    }
}
