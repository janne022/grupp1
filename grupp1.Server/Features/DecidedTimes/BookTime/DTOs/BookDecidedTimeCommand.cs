namespace Vicaria.Server.Features.DecidedTimes.BookTime.DTOs
{
    public record class BookDecidedTimeCommand
    {
        public Guid AvailableTimeGuid { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public Guid KindergartenId { get; set; }
        public Guid ManagerId { get; set; }
    }
}
