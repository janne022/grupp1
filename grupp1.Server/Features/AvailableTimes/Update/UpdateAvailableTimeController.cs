using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Domain;
using Vicaria.Server.Features.AvailableTimes.Update.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.AvailableTimes.Update
{
    [Route("api/available-times")]
    [Authorize(Roles = VicariaUserRoles.Substitute)]
    [ApiController]
    [Tags("AvailableTimes")]
    public class UpdateAvailableTimeController(
        IHandler<UpdateAvailableTimeCommand, UpdateAvailableTimeResponse> handler,
        ILogger<UpdateAvailableTimeController> logger
    ) : ControllerBase
    {
        [HttpPatch("{availableTimeId:guid}")]
        public async Task<ActionResult<UpdateAvailableTimeResponse>> Patch(
            [FromRoute] Guid availableTimeId,
            [FromBody] UpdateAvailableTimeRequest request,
            CancellationToken cancellationToken
        )
        {
            if (request is null)
            {
                return BadRequest();
            }

            var userClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userClaim, out var userId))
            {
                return Unauthorized();
            }

            var command = new UpdateAvailableTimeCommand(
                availableTimeId,
                userId,
                request.StartTime,
                request.EndTime,
                request.Kindergartens?.ToHashSet()
            );

            var response = await handler.HandleAsync(command, cancellationToken);

            return response.StatusMessage switch
            {
                UpdateAvailableTimeStatus.Ok => Ok(response),
                UpdateAvailableTimeStatus.BadTime => BadRequest(response),
                UpdateAvailableTimeStatus.WasNull => NotFound(response),
                UpdateAvailableTimeStatus.NotOwner => Forbid(),
                _ => UnknownError(command.AvailableTimeId),
            };
        }

        private ActionResult UnknownError(Guid timeId)
        {
            logger.LogError("Reached unknown error when looking for {TimeId}", timeId);
            return Problem();
        }
    }
}
