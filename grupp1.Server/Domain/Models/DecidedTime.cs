namespace Vicaria.Server.Domain.Models;

public class DecidedTime
{
    public Guid Id { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid KindergartenId { get; set; }
    public Kindergarten Kindergarten { get; set; } = null!;
}