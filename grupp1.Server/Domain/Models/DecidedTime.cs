namespace Vicaria.Server.Domain.Models;

public class DecidedTime
{
    public Guid Id { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public Guid SubstituteId { get; set; }
    public User Substitute { get; set; } = null!;
    public Guid KindergartenId { get; set; }
    public Kindergarten Kindergarten { get; set; } = null!;
    public Guid PendingTimeId { get; set; }
    public PendingTime PendingTime { get; set; } = null!;
    public Guid ManagerId { get; set; }
    public User Manager { get; set; } = null!;
}
