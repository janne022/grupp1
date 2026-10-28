using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Domain;
using Vicaria.Server.Features.DecidedTimes.GetAll.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.GetAll
{
    [Authorize(Roles = VicariaUserRoles.Manager)]
    [Route("api/decidedtime")]
    [ApiController]
    public class GetAllDecidedTimesController(
        IHandler<GetAllDecidedTimesQuery, GetAllDecidedTimesResponse> handler
    ) : ControllerBase
    {
        [HttpGet]
        public async Task<ActionResult<GetAllDecidedTimesResponse>> GetAll(
            [FromQuery] Guid[]? kindergartenIds,
            [FromQuery] DateTime? fromTime,
            [FromQuery] DateTime? toTime,
            CancellationToken cancellationToken
        )
        {
            if (fromTime >= toTime)
            {
                return BadRequest();
            }

            var userClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userClaim, out var managerId))
            {
                return Unauthorized();
            }

            var query = new GetAllDecidedTimesQuery(managerId, kindergartenIds, fromTime, toTime);

            var response = await handler.HandleAsync(query, cancellationToken);

            return response.Report switch
            {
                GetAllDecidedTimesStatus.Ok => Ok(response),
                GetAllDecidedTimesStatus.NoKindergartensSpecified => BadRequest(response),
                GetAllDecidedTimesStatus.NotManagerOfKindergarten => Forbid(),
                _ => Problem(),
            };
        }
    }
}
