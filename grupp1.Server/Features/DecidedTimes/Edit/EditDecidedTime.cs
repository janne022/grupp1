using System.Security.Claims;
using Microsoft.AspNetCore.Authorization; // To use Authorize attribute
using Microsoft.AspNetCore.Mvc; // To use Controller attributes and inherit from ControllerBase
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain;
using Vicaria.Server.Domain.Models;
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

public class EditDecidedTimeHandler : IHandler<EditDecidedTimeCommand, EditDecidedTimeResponse?>
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

    public async Task<EditDecidedTimeResponse?> HandleAsync(EditDecidedTimeCommand command, CancellationToken cancellationToken = default)
    {
        DecidedTime? decidedTime = await _dbContext.DecidedTimes
            .FirstOrDefaultAsync(decidedTime => decidedTime.Id == command.DecidedTimeId /*&& decidedTime.UserId == command.ManagerId*/); // uncommenting manager ownership from query due to faulty design in model.

        if (decidedTime is null)
        {
            _logger.LogWarning("Cannot patch edit decided time with ID {id}: does not exist in DB for user with ID {userId}", command.DecidedTimeId, command.ManagerId);
            return null;
        }

        if (command.NewKindergartenId is Guid id && id != default && id != decidedTime.KindergartenId)
        {
            _logger.LogInformation("Changing kindergartenId to {kindergartenId}, for DecidedTime object with ID {decidedTimeId}", command.NewKindergartenId, decidedTime.Id);
            decidedTime.KindergartenId = id;
        }

        if (command.NewStartTime is DateTime startTime && startTime != decidedTime.StartTime)
        {
            _logger.LogInformation("Changing startTimeId to {startTimeId} in decidedTime with Id: {decidedTimeId}", command.NewStartTime, decidedTime.Id);
            decidedTime.StartTime = startTime;
        }

        if (command.NewEndTime is DateTime endTime && endTime != decidedTime.EndTime)
        {
            _logger.LogInformation("Changing endTimeId to {endTimeId} in decidedTime with Id: {decidedTimeId}", command.NewEndTime, decidedTime.Id);
            decidedTime.EndTime = endTime;
        }

        if (decidedTime.StartTime >= decidedTime.EndTime)
        {
            _logger.LogWarning("Cannot have a start time that is equal to, or after endtime");
            return null;
        }

        await _dbContext.SaveChangesAsync();

        return new EditDecidedTimeResponse
        (
            ChangedKindergartenId: decidedTime.KindergartenId,
            ChangedStartTime: decidedTime.StartTime,
            ChangedEndTime: decidedTime.EndTime
        );
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
    Guid ChangedKindergartenId,
    DateTime ChangedStartTime,
    DateTime ChangedEndTime
);

#endregion