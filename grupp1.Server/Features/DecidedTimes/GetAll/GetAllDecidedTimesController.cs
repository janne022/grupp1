using System.Security.Claims;
using ErrorOr;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Features.DecidedTimes.GetAll.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.DecidedTimes.GetAll;

[Authorize]
[Route("api/decided-times")]
[ApiController]
[Tags("DecidedTimes")]
public class GetAllDecidedTimesController(
    IHandler<GetAllDecidedTimesQuery, ErrorOr<GetAllDecidedTimesResponse>> handler
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

        string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out Guid userId))
        {
            return Unauthorized();
        }

        GetAllDecidedTimesQuery query = new
        (
            userId,
            kindergartenIds,
            fromTime,
            toTime
        );

        ErrorOr<GetAllDecidedTimesResponse> response = await handler.HandleAsync(query, cancellationToken);

        return response.Match<ActionResult<GetAllDecidedTimesResponse>>(
            value => Ok(value),
            errors => this.ToProblem(errors)
        );
    }
}