using Vicaria.Server.Domain.Models;
using Vicaria.Server.Infrastructure;
using Microsoft.EntityFrameworkCore;


namespace grupp1.Server.Features.AvailableTimes.Post
{
    public sealed class PostAvailableTimeHandler(VicariaDbContext context, ILogger<PostAvailableTimeHandler> _logger) : IHandler<PostAvailableTimeRequest, PostAvailableTimeResponse>
    {
        public async Task<PostAvailableTimeResponse> HandleAsync(PostAvailableTimeRequest request, CancellationToken cancellationToken = default)
        {

            if (request.EndTime <= request.StartTime)
            {
                _logger.LogInformation("Failed to create available time: EndTime must be later than StartTime");

                return new PostAvailableTimeResponse

                {
                    Success = false,
                    ErrorMessage = "EndTime must be later than StartTime"
                };
            }


            if (request.Kindergartens is null || request.Kindergartens.Count is 0)
            {
                _logger.LogInformation("Failed to create available time: No kindergartens provided");

                return new PostAvailableTimeResponse
                {
                    Success = false,
                    ErrorMessage = "At least one kindergarten must be provided"
                };
            }


            var availableTime = new AvailableTime // TODO: Add UserId once authorization is set up
            {
                Id = Guid.NewGuid(),
                StartTime = request.StartTime,
                EndTime = request.EndTime,

            };


            foreach (var kindergartenId in request.Kindergartens)
            {
                var kindergartenExist = await context.Kindergartens.AnyAsync(k => k.Id == kindergartenId, cancellationToken);

                if (!kindergartenExist)
                {
                    _logger.LogInformation($"Failed to create available time: Kindergarten with Id {kindergartenId} does not exist");

                    return new PostAvailableTimeResponse
                    {
                        Success = false,
                        ErrorMessage = $"Kindergarten with Id {kindergartenId} does not exist"
                    };

                }

                availableTime.Kindergartens.Add(new KindergartenAvailableTime
                {

                    KindergartenId = kindergartenId,
                    AvailableTimeId = availableTime.Id

                });
            }


            await context.AvailableTimes.AddAsync(availableTime, cancellationToken);


            await context.SaveChangesAsync(cancellationToken);

            _logger.LogInformation($"Available time {availableTime.Id} created successfully");

            return new PostAvailableTimeResponse
            {
                Id = availableTime.Id,
                Success = true
            };


        }
    }


}
