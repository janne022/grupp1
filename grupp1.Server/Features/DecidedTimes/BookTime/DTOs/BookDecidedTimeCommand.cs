namespace grupp1.Server.Features.DecidedTimes.BookTime.DTOs
{
    public record class BookDecidedTimeCommand
    {
        public Guid AvailableTimeGuid { get; set; }
        public Guid KindergartenId { get; set; }
        public Guid ManagerId { get; set; }
    }
}
