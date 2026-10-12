using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.AvailableTimes.Update;
using Vicaria.Server.Features.AvailableTimes.Update.DTOs;

namespace Vicaria.Server.Features.AvailableTimes.Update
{
    // TODO: Add Authorization tag when authorisation is up.
    [Route("api/availabletimes")]
    [ApiController]
    public class UpdateAvailableTimeController(UpdateAvailableTimeHandler handler) : ControllerBase
    {
        [HttpPut("updatetime")]
        public async Task<ActionResult<UpdateAvailableTimeResponse>> Update(
            [FromBody] UpdateAvailableTimeQuery query,
            CancellationToken ct,
            ILogger<UpdateAvailableTimeController> _logger
        )
        {
            var command = new UpdateAvailableTimeCommand(
                query.TimeId,
                query.StartTime,
                query.EndTime
            );

            var response = await handler.HandleAsync(command, ct);

            if (response.StatusMessage == UpdateAvailableTimeStatus.BadTime)
            {
                return BadRequest(response);
            }
            if (response.StatusMessage == UpdateAvailableTimeStatus.WasNull)
            {
                return NotFound(response);
            }

            if (response.StatusMessage == UpdateAvailableTimeStatus.Ok)
            {
                return Ok(response);
            }

            _logger.LogError("Reached unknown error when looking for {TimeId}", response.TimeId);
            return Problem();
        }
    }
}
