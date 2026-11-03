namespace Vicaria.Server.Features.AvailableTimes.Post
{
    public class PostAvailableTimeResponse
    {
        public Guid? Id { get; set; }
        public string? ErrorMessage { get; set; }
        public PostAvailableTimeStatus Status { get; set; }
    }

}
