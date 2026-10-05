namespace Vicaria.Server.Domain.Models;

public class AvailableTime
{
    public Guid Id { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public ICollection<KindergartenAvailableTime> KindergartenAvailableTimes { get; set; } = [];
}