using System.Security.Claims;
using ErrorOr;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Domain;
using Vicaria.Server.Features.PendingTimes.Accept.DTOs;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.PendingTimes.Accept;

[Route("api/decided-times")]
[Authorize(Roles = VicariaUserRoles.Substitute)]
[ApiController]

public class AcceptPendingTimeController(
    IHandler<AcceptPendingTimeQuery, ErrorOr<AcceptPendingTimeResponse>> handler,
    ILogger<AcceptPendingTimeController> logger
) : ControllerBase
{
    [HttpPost("/accept/{pending-time-id:guid}")]
    public async Task<ActionResult<AcceptPendingTimeResponse>> Accept(
        [FromRoute(Name = "pending-time-id")] Guid pendingTimeId,
        CancellationToken cancellationToken = default
    )
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var query = new AcceptPendingTimeQuery
        (
            pendingTimeId,
            userId
         );


        var result = handler.HandleAsync(query, cancellationToken);

        throw new NotImplementedException();
    }
}