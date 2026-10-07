using Vicaria.Server.Domain.Models;

namespace grupp1.Server.Features.AvailableTimes.Post
{
    public sealed record PostAvailableTimeRequest(

        DateTime StartTime,
        DateTime EndTime,
        HashSet<Guid> Kindergartens);
    
}
