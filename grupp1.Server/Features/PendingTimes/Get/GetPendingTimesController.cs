using System.Security.Claims;
using ErrorOr;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.PendingTimes.Get.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.PendingTimes.Get
{
    [Route("api/pending-times")]
    [Authorize]
    [ApiController]
    public class GetPendingTimesController(
        IHandler<GetPendingTimesQuery, ErrorOr<GetPendingTimesResponse>> Handler
    ) : ControllerBase
    {
        [HttpGet()]
        public async Task<ActionResult<GetPendingTimesResponse>> GetPendingTimes(
            [FromQuery] DateTime? fromTime,
            [FromQuery] DateTime? toTime,
            CancellationToken cancellationToken
        )
        {
            string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdClaim, out Guid userId))
            {
                return Unauthorized();
            }

            if (fromTime >= toTime)
            {
                return BadRequest();
            }

            GetPendingTimesQuery query = new
            (
                userId,
                fromTime,
                toTime
            );

            ErrorOr<GetPendingTimesResponse> response = await Handler.HandleAsync(query, cancellationToken);

            return response.Match<ActionResult<GetPendingTimesResponse>>
            (
                value => Ok(value),
                errors => this.ToProblem(errors)
            );
        }
    }
}
