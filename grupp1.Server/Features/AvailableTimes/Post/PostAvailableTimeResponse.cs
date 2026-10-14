namespace grupp1.Server.Features.AvailableTimes.Post
{
    public class PostAvailableTimeResponse
    {
        public Guid? Id { get; set; }
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
    }
   
}
