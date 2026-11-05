namespace Vicaria.Server.Domain.Models;

public class AvailableTime
{
    public Guid Id { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public Guid SubstituteId { get; set; }
    public User Substitute { get; set; } = null!;
    public HashSet<KindergartenAvailableTime> Kindergartens { get; set; } = [];
}