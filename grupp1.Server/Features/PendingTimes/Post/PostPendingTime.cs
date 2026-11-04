using System.Collections.Immutable;
using System.Security.Claims;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain;
using Vicaria.Server.Domain.Models;
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

public sealed class PostPendingTimeHandler : IHandler<PostPendingTimeCommand, PostPendingTimeResponse?>
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

    public async Task<PostPendingTimeResponse?> HandleAsync(PostPendingTimeCommand command, CancellationToken cancellationToken = default)
    {
        #region validation
        
        int matchedSubstitutes = await _dbContext.Users.Where(user => user.Id == command.ManagerId).CountAsync();
        int actualNumbersOfSubstitutes = command.AvailableSubstituteIds.Count();

        if (matchedSubstitutes != actualNumbersOfSubstitutes)
        {
            _logger.LogWarning("Unable to perform POST action on pending time object: All the given substitutes could not be found in the Database. Numbers found were {found}. Total number sent in was {actual}", matchedSubstitutes, actualNumbersOfSubstitutes);

            return null;
        }

        if (!await _dbContext.Kindergartens.AnyAsync(kindergarten => kindergarten.Id == command.KindergartenId))
        {
            _logger.LogWarning("Unable to perform POST action on pending time object: no kindergarten by the id {id} could be found in the database.", command.KindergartenId);

            return null;
        }

        if (command.StartTime >= command.EndTime)
        {
            _logger.LogWarning
            (
                "Unable to perform POST action on pending time object: Start time ({startTime}) cannot be equal to or later than End time ({endTime}).",
                command.StartTime,
                command.EndTime
            );

            return null;
        }
        #endregion

        PendingTime newPendingTime = new()
        {
            Id = command.PendingTimeId,
            IsBooked = false,
            KindergartenId = command.KindergartenId,
            StartTime = command.StartTime,
            EndTime = command.EndTime,
            AvailableSubs = [.. command.AvailableSubstituteIds.Select(subId => new UserPendingTime
            {
                UserId = subId,
                PendingTimeId = command.PendingTimeId,
            })]
        };

        await _dbContext.AddAsync(newPendingTime);
        await _dbContext.SaveChangesAsync();

        return new PostPendingTimeResponse
        (
            Id: newPendingTime.Id,
            IsBooked: newPendingTime.IsBooked,
            Kindergarten: new KindergartenDto(
                Id: newPendingTime.KindergartenId,
                KindergartenName: newPendingTime.Kindergarten.Name
            ),
            StartTime: newPendingTime.StartTime,
            EndTime: newPendingTime.EndTime,
            Substitutes: [.. newPendingTime.AvailableSubs.Select(userPendingTime => new SubstituteDto
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
    DateTime EndTime,
    Guid[] AvailableSubstituteIds
);

#endregion
#region Command

public record class PostPendingTimeCommand
(
    Guid PendingTimeId,
    Guid KindergartenId,
    Guid ManagerId,
    HashSet<Guid> AvailableSubstituteIds,

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