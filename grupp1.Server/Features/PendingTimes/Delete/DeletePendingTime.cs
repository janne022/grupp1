using System.Security.Claims;
using ErrorOr;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Infrastructure;

namespace Vicaria.Server.Features.PendingTimes.Delete
{
    [ApiController]
    [Tags("PendingTimes")]
    [Authorize(Roles = VicariaUserRoles.Manager)]
    [Route("api/pending-times")]
    public sealed class DeletePendingTimeController : ControllerBase
    {
        private readonly IHandler<DeletePendingTimeCommand, ErrorOr<Deleted>> _handler;
        public DeletePendingTimeController(IHandler<DeletePendingTimeCommand, ErrorOr<Deleted>> handler)
        {
            _handler = handler;
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> DeletePendingTime([FromRoute] Guid id, CancellationToken cancellationToken = default)
        {
            string? managerIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(managerIdClaim, out Guid managerId))
            {
                return Unauthorized();
            }

            ErrorOr<Deleted> response = await _handler.HandleAsync(new DeletePendingTimeCommand(id, managerId), cancellationToken);

            return response.Match<IActionResult>
            (
                _ => NoContent(),
                errors => this.ToProblem(errors)
            );
        }
    }

    public sealed class DeletePendingTimeHandler : IHandler<DeletePendingTimeCommand, ErrorOr<Deleted>>
    {
        private readonly ILogger<DeletePendingTimeHandler> _logger;
        private readonly VicariaDbContext _dbContext;

        public DeletePendingTimeHandler(ILogger<DeletePendingTimeHandler> logger, VicariaDbContext dbContext)
        {
            _logger = logger;
            _dbContext = dbContext;
        }

        public async Task<ErrorOr<Deleted>> HandleAsync(DeletePendingTimeCommand command, CancellationToken cancellationToken = default)
        {
            PendingTime? pendingTime = await _dbContext.PendingTimes
                .FirstOrDefaultAsync(pendingTime =>
                    pendingTime.Id == command.PendingTimeId &&
                    pendingTime.ManagerId == command.ManagerId,
                    cancellationToken
                );

            if (pendingTime is null)
            {
                _logger.LogWarning("Cannot delete pending time with ID {id}: does not exist for manager with ID {managerId}", command.PendingTimeId, command.ManagerId);
                return Error.NotFound("Pending time not found.");
            }

            _dbContext.PendingTimes.Remove(pendingTime);
            await _dbContext.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("PendingTime {id} removed successfully", pendingTime.Id);

            return Result.Deleted;
        }
    }
    public record class DeletePendingTimeCommand
    (
        Guid PendingTimeId,
        Guid ManagerId
    );
}

