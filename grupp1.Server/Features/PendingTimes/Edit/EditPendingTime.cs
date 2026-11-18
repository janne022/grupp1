using System.Security.Claims;
using ErrorOr;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Features.PendingTimes.Post;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.PendingTimes.Edit
{
    [ApiController]
    [Tags("PendingTimes")]
    [Authorize(Roles = VicariaUserRoles.Manager)]
    [Route("api/pending-times")]
    public sealed class EditPendingTimeController : ControllerBase
    {
        private readonly IHandler<EditPendingTimeCommand, ErrorOr<EditPendingTimeResponse>> _handler;
        public EditPendingTimeController(IHandler<EditPendingTimeCommand, ErrorOr<EditPendingTimeResponse>> handler)
        {
            _handler = handler;
        }

        [HttpPatch]
        public async Task<ActionResult<EditPendingTimeResponse>> EditPendingTime([FromBody] EditPendingTimeRequest request, CancellationToken cancellationToken = default)
        {
            string? managerIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(managerIdClaim, out Guid managerId))
            {
                return Unauthorized();
            }

            EditPendingTimeCommand command = new
            (
                PendingTimeId: request.Id,
                ManagerId: managerId,
                NewKindergartenId: request.KindergartenId,
                NewStartTime: request.StartTime,
                NewEndTime: request.EndTime
            );

            ErrorOr<EditPendingTimeResponse> response = await _handler.HandleAsync(command, cancellationToken);

            return response.Match<ActionResult<EditPendingTimeResponse>>
            (
                value => Ok(value),
                errors => this.ToProblem(errors)
            );
        }
    }

    public sealed class EditPendingTimeHandler : IHandler<EditPendingTimeCommand, ErrorOr<EditPendingTimeResponse>>
    {
        private readonly ILogger<EditPendingTimeHandler> _logger;
        private readonly VicariaDbContext _dbContext;

        public EditPendingTimeHandler(ILogger<EditPendingTimeHandler> logger, VicariaDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        public async Task<ErrorOr<EditPendingTimeResponse>> HandleAsync(EditPendingTimeCommand command, CancellationToken cancellationToken = default)
        {
            PendingTime? pendingTime = await _dbContext.PendingTimes
                .Include(pendingTime => pendingTime.AvailableSubs)
                .FirstOrDefaultAsync(pendingTime =>
                    pendingTime.Id == command.PendingTimeId &&
                    pendingTime.ManagerId == command.ManagerId,
                    cancellationToken
                );

            if (pendingTime is null)
            {
                _logger.LogWarning("Cannot edit pending time with ID {id}: does not exist for manager with ID {managerId}", command.PendingTimeId, command.ManagerId);
                return Error.NotFound("Pending time not found.");
            }

            if (pendingTime.IsBooked)
            {
                _logger.LogWarning("Cannot edit pending time with ID {id}: it has already been booked", pendingTime.Id);
                return Error.Conflict("Pending time has already been booked.");
            }

            bool shouldRecalculateSubstitutes = false;

            if (command.NewKindergartenId is Guid kindergartenId && kindergartenId != default && kindergartenId != pendingTime.KindergartenId)
            {
                bool managesKindergarten = await _dbContext.Kindergartens
                    .AnyAsync(kindergarten =>
                        kindergarten.Id == kindergartenId &&
                        kindergarten.Managers.Any(manager => manager.UserId == command.ManagerId),
                        cancellationToken
                    );

                if (!managesKindergarten)
                {
                    return Error.Validation("Manager does not manage the given kindergarten.");
                }

                pendingTime.KindergartenId = kindergartenId;
                shouldRecalculateSubstitutes = true;
            }

            if (command.NewStartTime is DateTime startTime && startTime != pendingTime.StartTime)
            {
                pendingTime.StartTime = startTime;
                shouldRecalculateSubstitutes = true;
            }

            if (command.NewEndTime is DateTime endTime && endTime != pendingTime.EndTime)
            {
                pendingTime.EndTime = endTime;
                shouldRecalculateSubstitutes = true;
            }

            if (pendingTime.StartTime >= pendingTime.EndTime)
            {
                _logger.LogWarning("Cannot edit pending time with ID {id}: start time must be before end time", pendingTime.Id);
                return Error.Validation("Start time cannot be equal to or later than end time.");
            }

            if (shouldRecalculateSubstitutes)
            {
                HashSet<Guid> availableSubstituteIds = await _dbContext.AvailableTimes
                    .Where(availableTime =>
                        availableTime.StartTime <= pendingTime.StartTime &&
                        availableTime.EndTime >= pendingTime.EndTime &&
                        availableTime.Kindergartens.Any(kat => kat.KindergartenId == pendingTime.KindergartenId)
                    )
                    .Select(availableTime => availableTime.UserId)
                    .ToHashSetAsync(cancellationToken);

                pendingTime.AvailableSubs.RemoveWhere(sub => !availableSubstituteIds.Contains(sub.UserId));

                HashSet<Guid> existingSubstituteIds = [.. pendingTime.AvailableSubs.Select(sub => sub.UserId)];

                foreach (Guid substituteId in availableSubstituteIds.Where(id => !existingSubstituteIds.Contains(id)))
                {
                    pendingTime.AvailableSubs.Add(new UserPendingTime
                    {
                        UserId = substituteId,
                        PendingTimeId = pendingTime.Id
                    });
                }
            }

            await _dbContext.SaveChangesAsync(cancellationToken);

            PendingTime updatedPendingTime = await _dbContext.PendingTimes
                .AsNoTracking()
                .Include(pendingTime => pendingTime.Kindergarten)
                .Include(pendingTime => pendingTime.AvailableSubs)
                .ThenInclude(availableSub => availableSub.User)
                .FirstAsync(pendingTime => pendingTime.Id == command.PendingTimeId, cancellationToken);

            return new EditPendingTimeResponse
            (
                Id: updatedPendingTime.Id,
                IsBooked: updatedPendingTime.IsBooked,
                Kindergarten: new KindergartenDto
                (
                    Id: updatedPendingTime.KindergartenId,
                    Name: updatedPendingTime.Kindergarten.Name
                ),
                StartTime: updatedPendingTime.StartTime,
                EndTime: updatedPendingTime.EndTime,
                Substitutes: [.. updatedPendingTime.AvailableSubs.Select(userPendingTime => new SubstituteDto
                (
                    Id: userPendingTime.UserId,
                    FullName: $"{userPendingTime.User.FirstName} {userPendingTime.User.LastName}",
                    FirstName: userPendingTime.User.FirstName,
                    LastName: userPendingTime.User.LastName
                ))]
            );
        }
    }

    public record class EditPendingTimeRequest
    (
        Guid Id,
        Guid? KindergartenId,
        DateTime? StartTime,
        DateTime? EndTime
    );

    public record class EditPendingTimeCommand
    (
        Guid PendingTimeId,
        Guid ManagerId,
        Guid? NewKindergartenId,
        DateTime? NewStartTime,
        DateTime? NewEndTime
    );

    public record class EditPendingTimeResponse
    (
        Guid Id,
        bool IsBooked,
        KindergartenDto Kindergarten,
        DateTime StartTime,
        DateTime EndTime,
        SubstituteDto[] Substitutes
    );
}

