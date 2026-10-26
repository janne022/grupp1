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
        IHandler<UpdateAvailableTimeCommand, UpdateAvailableTimeResponse> handler
    ) : ControllerBase
    {
        [HttpPut()]
        public async Task<ActionResult<UpdateAvailableTimeResponse>> Update(
            [FromBody] UpdateAvailableTimeQuery query,
            CancellationToken cancellationToken,
            ILogger<UpdateAvailableTimeController> _logger
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

            switch (response.StatusMessage)
            {
                case UpdateAvailableTimeStatus.Ok:
                {
                    return Ok(response);
                }

                case UpdateAvailableTimeStatus.BadTime:
                {
                    return BadRequest(response);
                }

                case UpdateAvailableTimeStatus.WasNull:
                {
                    return NotFound(response);
                }

                case UpdateAvailableTimeStatus.NotOwner:
                {
                    return Forbid();
                }
            }

            _logger.LogError("Reached unknown error when looking for {TimeId}", command.TimeId);
            return Problem();
        }
    }
}
