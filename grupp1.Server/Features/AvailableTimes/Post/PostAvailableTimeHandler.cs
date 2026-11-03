using Microsoft.EntityFrameworkCore;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Infrastructure;


namespace Vicaria.Server.Features.AvailableTimes.Post
{
    public sealed class PostAvailableTimeHandler(VicariaDbContext context, ILogger<PostAvailableTimeHandler> _logger) : IHandler<PostAvailableTimeCommand, PostAvailableTimeResponse>
    {
        public async Task<PostAvailableTimeResponse> HandleAsync(PostAvailableTimeCommand command, CancellationToken cancellationToken = default)
        {

            if (command.EndTime <= command.StartTime)
            {
                _logger.LogInformation("Failed to create available time: EndTime must be later than StartTime");

                return new PostAvailableTimeResponse
                {
                    ErrorMessage = "EndTime must be later than StartTime",
                    Status = PostAvailableTimeStatus.BadRequest
                };
            }


            if (command.Kindergartens is null || command.Kindergartens.Count is 0)
            {
                _logger.LogInformation("Failed to create available time: No kindergartens provided");

                return new PostAvailableTimeResponse
                {
                    ErrorMessage = "At least one kindergarten must be provided",
                    Status = PostAvailableTimeStatus.BadRequest
                };
            }


            var requestedKindergartenIds = command.Kindergartens;

            var existingCount = await context.Kindergartens.CountAsync(kg => requestedKindergartenIds.Contains(kg.Id), cancellationToken);

            if(existingCount != requestedKindergartenIds.Count)
            {
                _logger.LogInformation("Failed to create available time: One or more kindergartens could not be found");

                return new PostAvailableTimeResponse
                {
                    ErrorMessage = "Kindergarten could not be found",
                    Status = PostAvailableTimeStatus.NotFound
                };
            }

            var hasOverlap = await context.AvailableTimes
                                           .Where(at => at.UserId == command.UserId
                                           && at.StartTime < command.EndTime
                                           && at.EndTime > command.StartTime
                                           && at.Kindergartens.Any(kg => requestedKindergartenIds.Contains(kg.KindergartenId)))
                                           .AnyAsync(cancellationToken);

            if(hasOverlap)
            {
                _logger.LogInformation("Failed to create available time: User {UserId} already has an overlapping available time", command.UserId);

                return new PostAvailableTimeResponse
                {
                    ErrorMessage = "You already have an available time overlapping this period for one or more of the selected kindergartens",
                    Status = PostAvailableTimeStatus.Conflict
                };
            }

            var availableTime = new AvailableTime
            {
                Id = Guid.NewGuid(),
                StartTime = command.StartTime,
                EndTime = command.EndTime,
                UserId = command.UserId
            };

            foreach(var kindergartenId in requestedKindergartenIds)
            {
                availableTime.Kindergartens.Add(new KindergartenAvailableTime
                {
                    KindergartenId = kindergartenId,
                    AvailableTimeId = availableTime.Id
                });
            }


            await context.AvailableTimes.AddAsync(availableTime, cancellationToken);

            await context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation("Available time {availableTimeId} created successfully", availableTime.Id);

            return new PostAvailableTimeResponse
            {
                Id = availableTime.Id,
                Status = PostAvailableTimeStatus.Ok
            };
        }
    }
}
