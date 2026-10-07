using grupp1.Server.Infrastructure;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Infrastructure;

namespace grupp1.Server.Features.AvailableTimes.Post
{
    public sealed class PostAvailableTimeHandler(VicariaDbContext context) : IHandler<PostAvailableTimeRequest, PostAvailableTimeResponse>
    {
        public async Task<PostAvailableTimeResponse> HandleAsync(PostAvailableTimeRequest request, CancellationToken cancellationToken = default)
        {
            var availableTime = new AvailableTime
            {
                Id = Guid.NewGuid(),
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                //UserId = userId

            };

            foreach(var kindergartenId in request.Kindergartens) 
            {
                availableTime.Kindergartens.Add(new KindergartenAvailableTime
                {
                    KindergartenId = kindergartenId
                });
            }



            await context.AvailableTimes.AddAsync(availableTime, cancellationToken);

            await context.SaveChangesAsync(cancellationToken);

            return new PostAvailableTimeResponse
            (
                availableTime.Id,
                availableTime.StartTime,
                availableTime.EndTime,
                //availableTime.UserId,
                request.Kindergartens.ToArray()

            );
        }
    }


}
