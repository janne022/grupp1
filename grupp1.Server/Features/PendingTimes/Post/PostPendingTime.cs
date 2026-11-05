using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Infrastructure;
using ErrorOr;

namespace Vicaria.Server.Features.PendingTimes.Post;

#region Controller
[ApiController]
[Authorize(Roles = VicariaUserRoles.Manager)]
[Route("api/pending-times")]
public sealed class PostPendingTimeController : ControllerBase
{
    #region Fields
    private readonly IHandler<PostPendingTimeCommand, ErrorOr<PostPendingTimeResponse>> _handler;
    #endregion
    #region Constructors
    public PostPendingTimeController(IHandler<PostPendingTimeCommand, ErrorOr<PostPendingTimeResponse>> handler)
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
            IsBooked: false,
            StartTime: request.StartTime,
            EndTime: request.EndTime
        );

        ErrorOr<PostPendingTimeResponse> response = await _handler.HandleAsync(command, cancellationToken);

        return response.Match<ActionResult<PostPendingTimeResponse>>
        (
            value => Ok(value),
            errors => this.ToProblem(errors)
        );
    }
    #endregion
}

#endregion
#region Handler

public sealed class PostPendingTimeHandler : IHandler<PostPendingTimeCommand, ErrorOr<PostPendingTimeResponse>>
{
    #region Fields

    private readonly ILogger<PostPendingTimeHandler> _logger;
    private readonly VicariaDbContext _dbContext;

    #endregion
    #region Constructor
    public PostPendingTimeHandler(ILogger<PostPendingTimeHandler> logger, VicariaDbContext dbContext)
    {
        _logger = logger;
        _dbContext = dbContext;
    }

    #endregion
    #region Methods

    public async Task<ErrorOr<PostPendingTimeResponse>> HandleAsync(PostPendingTimeCommand command, CancellationToken cancellationToken = default)
    {
        #region validation
        if (command.StartTime >= command.EndTime)
        {
            _logger.LogWarning
            (
                "Unable to perform POST action on pending time object: Start time ({startTime}) cannot be equal to or later than End time ({endTime}).",
                command.StartTime,
                command.EndTime
            );

            return Error.Validation("Start time cannot be equal to or later than end time");
        }

        HashSet<UserPendingTime>? availableSubstitutes = await _dbContext.AvailableTimes
            .Where(availableTime =>
                availableTime.StartTime <= command.StartTime &&
                availableTime.EndTime >= command.EndTime &&
                availableTime.Kindergartens.Any(kat => kat.KindergartenId == command.KindergartenId)
            )
            .Select(availableTime => new UserPendingTime()
            {
                UserId = availableTime.UserId,
                PendingTimeId = command.PendingTimeId
            })
            .ToHashSetAsync();

        if (availableSubstitutes is null)
        {
            _logger.LogWarning
            (
                "Unable to perform POST action on pending time object: available substitute object returned as null from the database."
            );

            return Error.Unexpected("available substitute object returned as null from the database.");
        }
        #endregion

        PendingTime newPendingTime = new()
        {
            Id = command.PendingTimeId,
            IsBooked = false,
            KindergartenId = command.KindergartenId,
            StartTime = command.StartTime,
            EndTime = command.EndTime,
            AvailableSubs = availableSubstitutes
        };

        await _dbContext.AddAsync(newPendingTime);
        await _dbContext.SaveChangesAsync();

        PendingTime? fetchedNewPendingTime = await _dbContext.PendingTimes
            .Include(pendingTime => pendingTime.Kindergarten)
            .Include(pendingTime => pendingTime.AvailableSubs)
            .ThenInclude(availableSub => availableSub.User)
            .FirstOrDefaultAsync(pendingTime => pendingTime.Id == command.PendingTimeId)
        ;

        if (fetchedNewPendingTime is null)
        {
            _logger.LogWarning("Could not fetch newly created and added PendingTime with ID {id} from Database", newPendingTime.Id);

            return Error.Unexpected("Could not fetch newly created and added PendingTime from database");
        }

        return new PostPendingTimeResponse
        (
            Id: fetchedNewPendingTime.Id,
            IsBooked: fetchedNewPendingTime.IsBooked,
            Kindergarten: new KindergartenDto(
                Id: fetchedNewPendingTime.KindergartenId,
                KindergartenName: fetchedNewPendingTime.Kindergarten.Name
            ),
            StartTime: fetchedNewPendingTime.StartTime,
            EndTime: fetchedNewPendingTime.EndTime,
            Substitutes: [.. fetchedNewPendingTime.AvailableSubs.Select(userPendingTime => new SubstituteDto
            (
                Id: userPendingTime.UserId,
                FullName: $"{userPendingTime.User.FirstName} {userPendingTime.User.LastName}",
                FirstName: userPendingTime.User.FirstName,
                LastName: userPendingTime.User.LastName
            ))]
        );
    }

    #endregion
}

#endregion
#region DTOs

#region Request
public record class PostPendingTimeRequest
(
    Guid KindergartenId,
    DateTime StartTime,
    DateTime EndTime
);

#endregion
#region Command

public record class PostPendingTimeCommand
(
    Guid PendingTimeId,
    Guid KindergartenId,
    Guid ManagerId,

    bool IsBooked,
    DateTime StartTime,
    DateTime EndTime
);

#endregion
#region Response
public record class PostPendingTimeResponse
(
    Guid Id,
    bool IsBooked,
    KindergartenDto Kindergarten,
    DateTime StartTime,
    DateTime EndTime,
    SubstituteDto[] Substitutes
);

#endregion
#region fraction DTOs
public record class KindergartenDto
(
    Guid Id,
    string KindergartenName
);

public record class SubstituteDto
(
    Guid Id,
    string FullName,
    string FirstName,
    string LastName
);

#endregion

#endregion