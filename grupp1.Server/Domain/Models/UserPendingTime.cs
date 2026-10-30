using Microsoft.EntityFrameworkCore;

namespace Vicaria.Server.Domain.Models;

[PrimaryKey(nameof(UserId), nameof(PendingTimeId))]
public class UserPendingTime
{
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public Guid PendingTimeId { get; set; }
    public PendingTime PendingTime { get; set; } = null!;
}