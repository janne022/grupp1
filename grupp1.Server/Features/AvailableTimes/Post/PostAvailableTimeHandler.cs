using grupp1.Server.Infrastructure;
using Vicaria.Server.Domain.Models;
using Vicaria.Server.Infrastructure;
using Microsoft.EntityFrameworkCore;


namespace grupp1.Server.Features.AvailableTimes.Post
{
    public sealed class PostAvailableTimeHandler(VicariaDbContext context) : IHandler<PostAvailableTimeRequest, PostAvailableTimeResponse>
    {
        public async Task<PostAvailableTimeResponse> HandleAsync(PostAvailableTimeRequest request, CancellationToken cancellationToken = default)
        {

            if(request.EndTime <= request.StartTime)
            {
                return new PostAvailableTimeResponse
                {
                    Success = false,
                    ErrorMessage = "EndTime must be later than StartTime"
                };
            }


            var availableTime = new AvailableTime // Add UserId once authorization is set up
            {
                Id = Guid.NewGuid(),
                StartTime = request.StartTime,
                EndTime = request.EndTime,
                //UserId = userId

            };

            foreach(var kindergartenId in request.Kindergartens) 
            {
                var kindergartenExist = await context.Kindergartens.AnyAsync(k => k.Id == kindergartenId, cancellationToken);

                if (!kindergartenExist)
                {
                    return new PostAvailableTimeResponse
                    {
                        Success = false,
                        ErrorMessage = $"Kindergarten with Id {kindergartenId} does not exist"
                    };
                        
                }

                availableTime.Kindergartens.Add(new KindergartenAvailableTime
                {

                    KindergartenId = kindergartenId, 

                });
            }


            await context.AvailableTimes.AddAsync(availableTime, cancellationToken);

            await context.SaveChangesAsync(cancellationToken);

            return new PostAvailableTimeResponse
            {
                Id = availableTime.Id,
                Success = true
            };
                
           
        }
    }


}
