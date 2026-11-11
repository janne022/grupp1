using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vicaria.Server.Domain;
using ErrorOr;
using Vicaria.Server.Infrastructure;
using System.Security.Claims;
using Vicaria.Server.Domain.Models;
using Microsoft.EntityFrameworkCore;

namespace Vicaria.Server.Features.PendingTimes.Delete;

#region Controller
[ApiController]
[Authorize(Roles = VicariaUserRoles.Substitute)]
[Route("api/pending-times")]
public sealed class RemoveCurrentUserController : ControllerBase
{
    private readonly IHandler<RemoveCurrentUserCommand, ErrorOr<RemoveCurrentUserResponse>> _handler;
    public RemoveCurrentUserController(IHandler<RemoveCurrentUserCommand, ErrorOr<RemoveCurrentUserResponse>> handler)
    {
        _handler = handler;
    }

    [HttpDelete("{pendingTimeId}/substitute")]
    public async Task<ActionResult<RemoveCurrentUserResponse>> RemoveCurrentUser([FromRoute(Name = "pendingTimeId")] Guid pendingTimeId)
    {
        string? substituteIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(substituteIdClaim, out Guid substituteId))
        {
            return Unauthorized();
        }

        RemoveCurrentUserCommand command = new(substituteId, pendingTimeId);

        ErrorOr<RemoveCurrentUserResponse> response = await _handler.HandleAsync(command);

        return response.Match<ActionResult<RemoveCurrentUserResponse>>
        (
            value => Ok(value),
            errors => this.ToProblem(errors)
        );
    }
}
#endregion
#region Handler
public class RemoveCurrentUserHandler : IHandler<RemoveCurrentUserCommand, ErrorOr<RemoveCurrentUserResponse>>
{
    private readonly VicariaDbContext _dbContext;
    private readonly ILogger<RemoveCurrentUserHandler> _logger;
    public RemoveCurrentUserHandler(VicariaDbContext dbContext, ILogger<RemoveCurrentUserHandler> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }
    public async Task<ErrorOr<RemoveCurrentUserResponse>> HandleAsync(RemoveCurrentUserCommand command, CancellationToken cancellationToken = default)
    {
        PendingTime? pendingTime = await _dbContext.PendingTimes
            .Include(pendingTime => pendingTime.AvailableSubs)
            .ThenInclude(substite => substite.User)
            .Include(pendingTime => pendingTime.Kindergarten)
            .FirstOrDefaultAsync(pendingTime => pendingTime.Id == command.PendingTimeId)
        ;

        if (pendingTime is null)
        {
            _logger.LogWarning("Remove current user from pending time FAILED: could not find pendingTime with ID {id}", command.PendingTimeId);
            return Error.NotFound("PendingTime.NotFound", "Could not find the pendingTime by the given ID");
        }

        int substitutesRemoved = pendingTime.AvailableSubs.RemoveWhere(userPendingTime => userPendingTime.UserId == command.UserId);

        if (substitutesRemoved is 0)
        {
            _logger.LogWarning(
                "Remove current user from pending time FAILED: could not remove the substitute ({subId}) from the pending time ({ptId})",
                command.UserId,
                pendingTime.Id
            );

            return Error.Unexpected("PendingTime.SubstituteNotFound", "Could not remove current substitute from pendingTime");
        }

        await _dbContext.SaveChangesAsync();

        return new RemoveCurrentUserResponse
        (
            Id: pendingTime.Id,
            StartTime: pendingTime.StartTime,
            EndTime: pendingTime.EndTime,
            Kindergarten: new KindergartenDto
            (
                pendingTime.KindergartenId,
                pendingTime.Kindergarten.Name
            ),
            Substitutes: [.. pendingTime.AvailableSubs.Select(substitute => new SubstituteDto
            (
                Id: substitute.UserId,
                FullName: $"{substitute.User.FirstName} {substitute.User.LastName}",
                FirstName: substitute.User.FirstName,
                LastName: substitute.User.LastName
            ))]
        );
    }
}
#endregion
#region DTOs
public record class RemoveCurrentUserResponse
(
    Guid Id,
    DateTime StartTime,
    DateTime EndTime,
    KindergartenDto Kindergarten,
    SubstituteDto[] Substitutes
);

public record class RemoveCurrentUserCommand
(
    Guid UserId,
    Guid PendingTimeId
);

public record class KindergartenDto(
    Guid Id,
    string KindergartenName
);

public record class SubstituteDto(
    Guid Id,
    string FullName,
    string FirstName,
    string LastName
);
#endregion