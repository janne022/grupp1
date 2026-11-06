namespace Vicaria.Server.Features.AvailableTimes.Post
{
    public class PostAvailableTimeCommand
    {
        public DateTime StartTime { get; init; }
        public DateTime EndTime { get; init; }
        public HashSet<Guid> Kindergartens { get; init; } = [];
        public Guid UserId { get; init; }
    }
}
