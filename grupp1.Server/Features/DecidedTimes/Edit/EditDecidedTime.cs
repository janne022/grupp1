using System.Security.Claims;
using Microsoft.AspNetCore.Authorization; // To use Authorize attribute
using Microsoft.AspNetCore.Mvc; // To use Controller attributes and inherit from ControllerBase
using Vicaria.Server.Domain;
using Vicaria.Server.Infrastructure; // To use IHandler interface

namespace Vicaria.Server.Features.DecidedTimes.Edit;

#region Controller

[ApiController]
[Authorize(Roles = VicariaUserRoles.Manager)]
[Route("api/decidedtimes")]
public sealed class EditDecidedTimeController : ControllerBase
{
    #region Fields
    private readonly IHandler<EditDecidedTimeCommand, EditDecidedTimeResponse> _handler;

    #endregion
    #region Constructor

    public EditDecidedTimeController(IHandler<EditDecidedTimeCommand, EditDecidedTimeResponse> handler)
    {
        _handler = handler;
    }

    #endregion
    #region Endpoint

    [HttpPatch]
    public async Task<ActionResult<EditDecidedTimeResponse>> EditDecidedTime([FromBody] EditDecidedTimeRequest request, CancellationToken cancellationToken = default)
    {
        string? userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdClaim, out Guid userId))
        {
            return Unauthorized();
        }

        EditDecidedTimeCommand command = new
        (
            DecidedTimeId: request.Id,
            ManagerId: userId,
            NewKindergartenId: request.KindergartenId,
            NewStartTime: request.StartTime,
            NewEndTime: request.EndTime
        );

        EditDecidedTimeResponse? response = await _handler.HandleAsync(command, cancellationToken);

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

public class EditDecidedTimeHandler : IHandler<EditDecidedTimeCommand, EditDecidedTimeResponse>
{
    #region Fields

    private readonly ILogger<EditDecidedTimeHandler> _logger;
    private readonly VicariaDbContext _dbContext;

    #endregion
    #region Constructors

    public EditDecidedTimeHandler(ILogger<EditDecidedTimeHandler> logger, VicariaDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    #endregion
    #region Methods

    public async Task<EditDecidedTimeResponse> HandleAsync(EditDecidedTimeCommand request, CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException();
    }

    #endregion
}

#endregion
#region DTOs

public record class EditDecidedTimeRequest
(
    Guid Id,
    Guid? KindergartenId,
    DateTime? StartTime,
    DateTime? EndTime
);

public record class EditDecidedTimeCommand
(
    Guid DecidedTimeId,
    Guid ManagerId,
    Guid? NewKindergartenId,
    DateTime? NewStartTime,
    DateTime? NewEndTime
);

public record class EditDecidedTimeResponse
(
    Guid? ChangedKindergartenId,
    DateTime? ChangedStartTime,
    DateTime? ChangedEndTime
);

#endregion