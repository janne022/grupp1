using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Domain;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.PendingTimes.Post;

#region Controller
[ApiController]
[Authorize(Roles = VicariaUserRoles.Manager)]
[Route("api/pending-times")]
public sealed class PostPendingTimeController : ControllerBase
{
    #region Fields
    private readonly IHandler<PostPendingTimeCommand, PostPendingTimeResponse?> _handler;
    #endregion
    #region Constructors
    public PostPendingTimeController(IHandler<PostPendingTimeCommand, PostPendingTimeResponse?> handler)
    {
        _handler = handler;
    }
    #endregion
    #region Methods

    [HttpPost]
    public async Task<ActionResult<PostPendingTimeResponse>> PostPendingTime([FromBody] PostPendingTimeRequest request, CancellationToken cancellationToken = default)
    {
        string? managerIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(managerIdClaim, out Guid managerId))
        {
            return Unauthorized();
        }
        
        PostPendingTimeCommand command = new
        (
            PendingTimeId: Guid.CreateVersion7(),
            KindergartenId: request.KindergartenId,
            ManagerId: managerId,
            AvailableSubstituteIds: [.. request.AvailableSubstituteIds],
            IsBooked: false,
            StartTime: request.StartTime,
            EndTime: request.EndTime
        );

        PostPendingTimeResponse? response = await _handler.HandleAsync(command, cancellationToken);

        if (response is null)
        {
            return NotFound();
        }

        return Ok(response);
    }
    #endregion
}

#endregion
#region Handler
#region Fields
#endregion
#region Constructors
#endregion
#region Methods
#endregion
#endregion
#region DTOs
#region Request
#endregion
#region Command
#endregion
#region Response
#endregion
#endregion