namespace Vicaria.Server.Domain.Models;

public class PendingTime
{
    public Guid Id { get; set; }
    public bool IsBooked { get; set; }
    public HashSet<UserPendingTime> Users { get; set; } = null!;
}