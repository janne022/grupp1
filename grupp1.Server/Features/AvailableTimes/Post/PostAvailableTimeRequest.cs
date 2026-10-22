

namespace grupp1.Server.Features.AvailableTimes.Post
{
    public record PostAvailableTimeRequest
    {
        public DateTime StartTime { get; init; }
        public DateTime EndTime { get; init; }
        public HashSet<Guid> Kindergartens { get; init; } = [];
        public Guid UserId { get; init; }
    
    }

    
}
